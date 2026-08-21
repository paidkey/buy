import { NextRequest, NextResponse } from "next/server";
import { notify } from "@/lib/ntfy";

/**
 * PayPal webhook receiver.
 *
 * PayPal posts JSON events like `PAYMENT.CAPTURE.COMPLETED` or
 * `CHECKOUT.ORDER.APPROVED`. Docs: https://developer.paypal.com/api/rest/webhooks/
 *
 * For production, verify the event signature server-side using PayPal's
 * `/v1/notifications/verify-webhook-signature` API with your
 * PAYPAL_WEBHOOK_ID and PAYPAL_CLIENT_ID / PAYPAL_CLIENT_SECRET before
 * trusting the payload — that call is omitted here since it needs a live
 * PayPal app; add it once your PayPal app credentials are set up.
 */
interface PayPalResource {
  amount?: { value?: string; currency_code?: string };
  payer?: { email_address?: string };
  payee?: { email_address?: string };
  custom_id?: string;
}

interface PayPalEvent {
  event_type?: string;
  resource?: PayPalResource;
}

export async function POST(req: NextRequest) {
  let payload: PayPalEvent;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const resource = payload.resource ?? {};
  const email = resource.payer?.email_address ?? "unknown";
  const amount = resource.amount
    ? `${resource.amount.value ?? "?"} ${resource.amount.currency_code ?? ""}`.trim()
    : "unknown amount";

  await notify(
    [
      `New order — ${email} — Paid via PayPal`,
      `Event: ${payload.event_type ?? "unknown"}`,
      `Amount: ${amount}`,
      resource.custom_id ? `Reference: ${resource.custom_id}` : "",
    ]
      .filter(Boolean)
      .join("\n"),
    "New PayPal payment"
  );

  return NextResponse.json({ ok: true });
}
