import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { notify } from "@/lib/ntfy";

/**
 * Razorpay webhook receiver (covers UPI and card payments routed through
 * Razorpay). Docs: https://razorpay.com/docs/webhooks/
 *
 * Razorpay signs each request with HMAC-SHA256 of the raw body using the
 * webhook secret you set in the Razorpay dashboard. Set
 * RAZORPAY_WEBHOOK_SECRET to the same value so the signature can be
 * verified before the payload is trusted.
 */
interface RazorpayPaymentEntity {
  email?: string;
  contact?: string;
  amount?: number; // paise
  currency?: string;
  notes?: Record<string, string>;
}

interface RazorpayEvent {
  event?: string;
  payload?: {
    payment?: { entity?: RazorpayPaymentEntity };
  };
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-razorpay-signature");
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

  if (secret) {
    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 401 });
    }
    const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
    const valid =
      expected.length === signature.length &&
      crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
    if (!valid) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }
  }

  let payload: RazorpayEvent;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const entity = payload.payload?.payment?.entity ?? {};
  const email = entity.email ?? entity.contact ?? "unknown";
  const amount = entity.amount
    ? `${(entity.amount / 100).toFixed(2)} ${entity.currency ?? "INR"}`
    : "unknown amount";

  await notify(
    [
      `New order — ${email} — Paid via UPI/Razorpay`,
      `Event: ${payload.event ?? "unknown"}`,
      `Amount: ${amount}`,
    ].join("\n"),
    "New Razorpay payment"
  );

  return NextResponse.json({ ok: true });
}
