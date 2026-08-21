import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { notify } from "@/lib/ntfy";

/**
 * NOWPayments IPN (Instant Payment Notification) receiver — covers BTC,
 * LTC, SOL, ETH, USDT and any other coin you enable in your NOWPayments
 * account. Docs: https://documenter.getpostman.com/view/7907941/S1a32n38#ipn
 *
 * NOWPayments signs the body: sort the JSON keys alphabetically, then
 * HMAC-SHA512 with your IPN secret. Set NOWPAYMENTS_IPN_SECRET to that
 * value so the signature can be verified before the payload is trusted.
 */
interface NowPaymentsPayload {
  payment_status?: string; // e.g. "finished", "confirmed", "waiting"
  price_amount?: number;
  price_currency?: string;
  pay_currency?: string;
  order_id?: string;
  order_description?: string;
  [key: string]: unknown;
}

function sortedStringify(obj: Record<string, unknown>): string {
  const sortedKeys = Object.keys(obj).sort();
  const sorted: Record<string, unknown> = {};
  for (const key of sortedKeys) sorted[key] = obj[key];
  return JSON.stringify(sorted);
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-nowpayments-sig");
  const secret = process.env.NOWPAYMENTS_IPN_SECRET;

  let payload: NowPaymentsPayload;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (secret) {
    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 401 });
    }
    const expected = crypto
      .createHmac("sha512", secret)
      .update(sortedStringify(payload))
      .digest("hex");
    const valid =
      expected.length === signature.length &&
      crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
    if (!valid) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }
  }

  const coin = (payload.pay_currency ?? "crypto").toUpperCase();
  const amount = payload.price_amount
    ? `${payload.price_amount} ${payload.price_currency ?? ""}`.trim()
    : "unknown amount";
  const email = payload.order_description ?? payload.order_id ?? "unknown";

  await notify(
    [
      `New order — ${email} — Paid via ${coin}`,
      `Status: ${payload.payment_status ?? "unknown"}`,
      `Amount: ${amount}`,
      payload.order_id ? `Order ID: ${payload.order_id}` : "",
    ]
      .filter(Boolean)
      .join("\n"),
    "New crypto payment"
  );

  return NextResponse.json({ ok: true });
}
