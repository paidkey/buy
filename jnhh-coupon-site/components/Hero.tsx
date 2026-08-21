export default function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 pt-16 pb-12 text-center">
      <span className="badge-pill inline-block rounded-full px-4 py-1 text-xs font-bold tracking-wider uppercase mb-6">
        ⭐ Official Website
      </span>
      <h1 className="display text-4xl sm:text-6xl font-bold text-white leading-tight">
        Get your <span className="glow-text">key</span>, your way
      </h1>
      <p className="text-[var(--muted)] mt-5 max-w-xl mx-auto text-base sm:text-lg">
        Request a Paid Key, pick the payment method you want to, and unlock full access. 
        Do not hesitate to contact us, Feel free to message us on any social media.
      </p>
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
        <a
          href="#request"
          className="btn-pill glow-box px-7 py-3 text-white"
          style={{ background: "var(--red)" }}
        >
          Request Your Code 🔑
        </a>
        <a
          href="#pricing"
          className="btn-pill px-7 py-3 text-white border"
          style={{ borderColor: "var(--red)" }}
        >
          See Pricing
        </a>
      </div>

      <ul className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-[var(--muted)]">
        <li className="flex items-center gap-2">
          <span style={{ color: "var(--red-bright)" }}>✓</span> Pay after you get your key (Message us on any social media for that)
        </li>
        <li className="flex items-center gap-2">
          <span style={{ color: "var(--red-bright)" }}>✓</span> Get paid key within 24 hours after payment via email
        </li>
        <li className="flex items-center gap-2">
          <span style={{ color: "var(--red-bright)" }}>✓</span> You will receive key on your mail so make sure to give right email
        </li>
      </ul>
    </section>
  );
}
