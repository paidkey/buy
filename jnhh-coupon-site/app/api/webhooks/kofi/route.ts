import { NextRequest, NextResponse } from "next/server";
import { notify } from "@/lib/ntfy";

/**
 * Ko-fi sends a single form-encoded field called "data" whose value is a
 * JSON string. Docs: https://more.ko-fi.com/manage/webhooks
 *
 * Relevant fields inside that JSON for a Shop Order / Donation:
 *   email, amount, currency, message, from_name, kofi_transaction_id,
 *   type ("Donation" | "Subscription" | "Shop Order"), shop_items[]
 *
 * Set KOFI_VERIFICATION_TOKEN (from your Ko-fi webhook settings page) to
 * confirm the payload actually came from Ko-fi before trusting it.
 */
interface KofiPayload {
  verification_token?: string;
  email?: string;
  amount?: string;
  currency?: string;
  message?: string;
  from_name?: string;
  type?: string;
  kofi_transaction_id?: string;
}

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const raw = form.get("data");

  if (typeof raw !== "string") {
    return NextResponse.json({ error: "Missing data field" }, { status: 400 });
  }

  let payload: KofiPayload;
  try {
    payload = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Invalid JSON in data field" }, { status: 400 });
  }

  const expectedToken = process.env.KOFI_VERIFICATION_TOKEN;
  if (expectedToken && payload.verification_token !== expectedToken) {
    return NextResponse.json({ error: "Invalid verification token" }, { status: 401 });
  }

  const email = payload.email ?? "unknown";
  const amount = payload.amount ? `${payload.amount} ${payload.currency ?? ""}`.trim() : "unknown amount";

  await notify(
    [
      `New order — ${email} — Paid via Ko-fi`,
      `Amount: ${amount}`,
      payload.type ? `Type: ${payload.type}` : "",
      payload.message ? `Message: ${payload.message}` : "",
    ]
      .filter(Boolean)
      .join("\n"),
    "New Ko-fi payment"
  );

  return NextResponse.json({ ok: true });
}
