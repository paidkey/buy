export default function SiteFooter() {
  return (
    <footer className="border-t mt-24" style={{ borderColor: "var(--card-border)" }}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[var(--muted)]">
        <div className="flex items-center gap-2">
          <span
            className="flex h-7 w-7 items-center justify-center rounded-md text-white text-xs font-bold"
            style={{ background: "var(--red)" }}
          >
            JH
          </span>
          <span>Need Help? Contact Us ➡️</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="https://discord.com/invite/xcy8w7ndQa" target="_blank" rel="noopener noreferrer" className="hover:text-white">
            Discord
          </a>
          <a href="https://www.instagram.com/jn_hh_gaming" target="_blank" rel="noopener noreferrer" className="hover:text-white">
            Instagram
          </a>
          <a href="https://t.me/jnhhgaming" target="_blank" rel="noopener noreferrer" className="hover:text-white">
            Telegram
          </a>
          <span>jnhhgaming.com</span>
        </div>
      </div>
    </footer>
  );
}
