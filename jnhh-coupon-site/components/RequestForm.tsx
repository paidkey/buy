"use client";

import { useState } from "react";
import type { PlanId } from "./PricingSection";

const PAYMENT_METHODS = [
  "Debit Card (Ko-fi)",
  "Credit Card (Ko-fi)",
  "UPI",
  "PayPal",
  "Bitcoin (BTC)",
  "Litecoin (LTC)",
  "Solana (SOL)",
  "Ethereum (ETH)",
  "Tether (USDT)",
] as const;

// Payment methods that route through Ko-fi's own checkout page — after a
// successful request, we send the buyer there to actually pay.
const KOFI_REDIRECT_METHODS = new Set([
  "Debit Card (Ko-fi)",
  "Credit Card (Ko-fi)",
  "PayPal",
]);
const KOFI_URL = "https://ko-fi.com/jnhhgaming";

type Status = "idle" | "submitting" | "success" | "error";

export default function RequestForm({
  selectedPlan,
}: {
  selectedPlan: { id: PlanId; label: string; price: string } | null;
}) {
  const [email, setEmail] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [customKey, setCustomKey] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [lastSubmittedMethod, setLastSubmittedMethod] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMsg("Enter a valid email address.");
      return;
    }
    if (!paymentMethod) {
      setErrorMsg("Choose a payment method.");
      return;
    }
    if (!selectedPlan) {
      setErrorMsg("Select a plan in the pricing section above before continuing.");
      return;
    }

    setStatus("submitting");
    try {
      const res = await fetch("/api/request-coupon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          paymentMethod,
          customKey: customKey || undefined,
          selectedPlan: selectedPlan
            ? `${selectedPlan.label} — ${selectedPlan.price}`
            : undefined,
        }),
      });

      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      setLastSubmittedMethod(paymentMethod);

      if (KOFI_REDIRECT_METHODS.has(paymentMethod)) {
        window.open(KOFI_URL, "_blank", "noopener,noreferrer");
      }

      setEmail("");
      setPaymentMethod("");
      setCustomKey("");
    } catch {
      setStatus("error");
      setErrorMsg("Something went wrong sending your request. Try again in a moment.");
    }
  }

  return (
    <section id="request" className="mx-auto max-w-2xl px-4 sm:px-6 py-16">
      <div className="text-center mb-8">
        <h2 className="display text-3xl sm:text-4xl font-bold text-white">
          Request Your <span className="glow-text">Code</span> 🔑
        </h2>
        <p className="text-[var(--muted)] mt-3">
          Register your request first — payment happens separately through the method you pick.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card glow-border rounded-[18px] p-6 sm:p-8 space-y-5">
        {selectedPlan ? (
          <div
            className="badge-pill inline-block rounded-full px-4 py-1 text-xs font-bold tracking-wide"
          >
            Selected plan: {selectedPlan.label} — {selectedPlan.price}
          </div>
        ) : (
          <p className="text-sm" style={{ color: "var(--red-bright)" }}>
            ⚠️ Pick a plan in the pricing section above before continuing.
          </p>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-white mb-2">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-xl border px-4 py-3 bg-transparent text-white placeholder:text-[var(--muted)] focus-ring"
            style={{ borderColor: "var(--card-border)" }}
          />
        </div>

        <div>
          <label htmlFor="paymentMethod" className="block text-sm font-semibold text-white mb-2">
            Payment method
          </label>
          <select
            id="paymentMethod"
            required
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full rounded-xl border px-4 py-3 bg-[#0f0b0c] text-white focus-ring"
            style={{ borderColor: "var(--card-border)" }}
          >
            <option value="" disabled>
              Select a payment method
            </option>
            {PAYMENT_METHODS.map((method) => (
              <option key={method} value={method}>
                {method}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="customKey" className="block text-sm font-semibold text-white mb-2">
            Custom Key
          </label>
          <input
            id="customKey"
            type="text"
            value={customKey}
            onChange={(e) => setCustomKey(e.target.value)}
            placeholder="e.g. MYKEY2026"
            className="w-full rounded-xl border px-4 py-3 bg-transparent text-white placeholder:text-[var(--muted)] focus-ring"
            style={{ borderColor: "var(--card-border)" }}
          />
          <p className="text-xs text-[var(--muted)] mt-1.5">
            Add a name for your key (optional)
          </p>
        </div>

        {errorMsg && (
          <p className="text-sm" style={{ color: "var(--red-bright)" }}>
            ⚠️ {errorMsg}
          </p>
        )}

        {status === "success" && (
          <p className="text-sm text-green-400">
            ✅ Request sent.{" "}
            {KOFI_REDIRECT_METHODS.has(lastSubmittedMethod)
              ? "We opened Ko-fi in a new tab so you can complete payment there."
              : "We'll follow up with next steps for your chosen payment method."}
          </p>
        )}

        <button
          type="submit"
          disabled={status === "submitting" || !selectedPlan}
          className="btn-pill glow-box w-full px-5 py-3 text-white disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ background: "var(--red)" }}
        >
          {status === "submitting"
            ? "Sending…"
            : !selectedPlan
            ? "Select a plan above first"
            : "Continue Payment"}
        </button>
      </form>
    </section>
  );
}
