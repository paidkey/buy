"use client";

import { useState } from "react";

const PLANS = [
  { id: "1month", label: "1 Month", price: "$7" },
  { id: "1year", label: "1 Year", price: "$50" },
  { id: "lifetime", label: "Lifetime", price: "$100" },
] as const;

export type PlanId = (typeof PLANS)[number]["id"];

export default function PricingSection({
  onSelectPlan,
}: {
  onSelectPlan: (plan: { id: PlanId; label: string; price: string } | null) => void;
}) {
  const [selected, setSelected] = useState<PlanId | null>(null);

  function choose(id: PlanId) {
    setSelected(id);
    const plan = PLANS.find((p) => p.id === id) ?? null;
    onSelectPlan(plan);
  }

  return (
    <section id="pricing" className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
      <div className="text-center mb-10">
        <span className="badge-pill inline-block rounded-full px-4 py-1 text-xs font-bold tracking-wider uppercase mb-4">
          Official Key System
        </span>
        <h2 className="display text-3xl sm:text-4xl font-bold text-white">
          Choose your <span className="glow-text">access</span>
        </h2>
        <p className="text-[var(--muted)] mt-3 max-w-xl mx-auto">
          Try it free, or unlock the full paid tier with the plan that fits you.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        {/* Free box */}
        <a
          href="https://jnhh-keysystem.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="card rounded-[18px] p-8 flex flex-col justify-between hover:-translate-y-1 transition-transform focus-ring"
        >
          <div>
            <span className="inline-block rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider mb-4 border border-[var(--card-border)] text-[var(--muted)]">
              Free
            </span>
            <h3 className="display text-2xl font-bold text-white mb-2">$0</h3>
            <p className="text-[var(--muted)] text-sm">
              Jump straight into the free key system — no payment, no waiting.
            </p>
          </div>
          <span className="btn-pill mt-8 inline-block text-center px-5 py-3 text-sm text-white border border-[var(--red)]">
            Open Free Key System →
          </span>
        </a>

        {/* Paid box */}
        <div className="card glow-border rounded-[18px] p-8 flex flex-col justify-between">
          <div>
            <span className="badge-pill inline-block rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider mb-4">
              Best Value
            </span>
            <h3 className="display text-2xl font-bold text-white mb-4">Paid Access</h3>

            <div className="grid grid-cols-3 gap-3">
              {PLANS.map((plan) => {
                const isSelected = selected === plan.id;
                return (
                  <button
                    key={plan.id}
                    type="button"
                    onClick={() => choose(plan.id)}
                    aria-pressed={isSelected}
                    className="rounded-xl border px-2 py-3 text-center transition-colors focus-ring"
                    style={{
                      borderColor: isSelected ? "var(--red)" : "var(--card-border)",
                      background: isSelected ? "rgba(255,31,61,0.12)" : "transparent",
                      boxShadow: isSelected ? "0 0 12px rgba(255,31,61,0.45)" : "none",
                    }}
                  >
                    <div className="text-xs uppercase tracking-wide text-[var(--muted)]">
                      {plan.label}
                    </div>
                    <div className="display font-bold text-white mt-1">{plan.price}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <a
            href="#request"
            className="btn-pill glow-box mt-8 inline-block text-center px-5 py-3 text-sm text-white"
            style={{ background: "var(--red)" }}
          >
            Continue to Request
          </a>
        </div>
      </div>
    </section>
  );
}
