export default function TopBanner() {
  return (
    <div
      className="sticky top-0 z-50 w-full text-center text-xs sm:text-sm font-semibold py-2 px-3"
      style={{
        background: "var(--red)",
        color: "#fff",
        boxShadow: "0 0 14px rgba(255,31,61,0.5)",
      }}
    >
      ⚠️ Afraid of getting scammed? Get your coupon first — pay later.
    </div>
  );
}
