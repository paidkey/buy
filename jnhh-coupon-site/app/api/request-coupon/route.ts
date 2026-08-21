import { NextRequest, NextResponse } from "next/server";
import { notify } from "@/lib/ntfy";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { email, paymentMethod, customCoupon, selectedPlan } = (body ?? {}) as {
    email?: string;
    paymentMethod?: string;
    customCoupon?: string;
    selectedPlan?: string;
  };

  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "A valid email is required" }, { status: 400 });
  }
  if (!paymentMethod) {
    return NextResponse.json({ error: "A payment method is required" }, { status: 400 });
  }

  // NOTE: this endpoint only registers the request. No payment is charged
  // here — the buyer completes payment separately through whichever method
  // they picked, and the corresponding webhook in app/api/webhooks/* is
  // what actually confirms the order.
  const lines = [
    `New coupon request`,
    `Email: ${email}`,
    `Payment method: ${paymentMethod}`,
  ];
  if (selectedPlan) lines.push(`Plan: ${selectedPlan}`);
  if (customCoupon) lines.push(`Custom coupon name: ${customCoupon}`);

  await notify(lines.join("\n"), "New coupon request");

  return NextResponse.json({ ok: true });
}
