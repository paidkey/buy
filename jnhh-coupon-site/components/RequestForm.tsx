"use client";

import { useState } from "react";
import type { PlanId } from "./PricingSection";
import { CRYPTO_WALLETS } from "@/lib/crypto-wallets";

const FIAT_METHODS = [
  "Debit Card (Ko-fi)",
  "Credit Card (Ko-fi)",
  "PayPal",
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
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  const selectedWallet = CRYPTO_WALLETS.find((w) => w.label === paymentMethod);

  async function handleCopy(address: string) {
    try {
      await navigator.clipboard.writeText(address);
      setCopiedAddress(address);
      setTimeout(() => setCopiedAddress(null), 2000);
    } catch {
      // Clipboard API can fail (e.g. insecure context) — address is still
      // visible as plain text so the buyer can select/copy it manually.
    }
  }

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

  const lastWasCrypto = CRYPTO_WALLETS.some((w) => w.label === lastSubmittedMethod);

  return (
    <section id="request" className="mx-auto max-w-2xl px-4 sm:px-6 py-16">
      <div className="text-center mb-8">
        <h2 className="display text-3xl sm:text-4xl font-bold text-white">
          Request Your <span className="glow-text">Key</span> 🔑
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
            <optgroup label="Card / Other">
              {FIAT_METHODS.map((method) => (
                <option key={method} value={method}>
                  {method}
                </option>
              ))}
            </optgroup>
            <optgroup label="Crypto">
              {CRYPTO_WALLETS.map((wallet) => (
                <option key={wallet.id} value={wallet.label}>
                  {wallet.label}
                </option>
              ))}
            </optgroup>
          </select>
        </div>

        {selectedWallet && (
          <div
            className="rounded-xl border p-4 space-y-3"
            style={{ borderColor: "var(--card-border)" }}
          >
            <p className="text-sm font-semibold text-white">
              Pay with {selectedWallet.coinName}
              {selectedWallet.network ? ` — ${selectedWallet.network}` : ""}
            </p>

            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                selectedWallet.address
              )}`}
              alt={`${selectedWallet.coinName} receive address QR code`}
              width={160}
              height={160}
              className="mx-auto rounded-lg bg-white p-2"
            />

            <div className="flex items-center gap-2">
              <code
                className="flex-1 break-all text-xs text-[var(--muted)] bg-[#0f0b0c] rounded-lg px-3 py-2 border"
                style={{ borderColor: "var(--card-border)" }}
              >
                {selectedWallet.address}
              </code>
              <button
                type="button"
                onClick={() => handleCopy(selectedWallet.address)}
                className="btn-pill px-3 py-2 text-xs text-white border shrink-0"
                style={{ borderColor: "var(--red)" }}
              >
                {copiedAddress === selectedWallet.address ? "Copied!" : "Copy"}
              </button>
            </div>

            <p className="text-xs text-[var(--muted)]">
              Send the equivalent of {selectedPlan ? selectedPlan.price : "your plan's price"}{" "}
              here — double-check you're sending on the{" "}
              {selectedWallet.network ?? selectedWallet.coinName} network. After sending, message
              us on Discord, Instagram, or Telegram with your transaction ID so we can confirm and
              send your key.
            </p>
          </div>
        )}

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
              : lastWasCrypto
              ? "Use the address above to send payment, then message us your transaction ID."
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
