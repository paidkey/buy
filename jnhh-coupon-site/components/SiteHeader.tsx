"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
const SOCIAL_LINKS = [
  { label: "Discord", href: "https://discord.com/invite/xcy8w7ndQa" },
  { label: "Instagram", href: "https://www.instagram.com/jn_hh_gaming" },
  { label: "Telegram", href: "https://t.me/jnhhgaming" },
];
export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header
      className="sticky top-[34px] sm:top-[38px] z-40 w-full border-b"
      style={{ background: "rgba(10,10,10,0.9)", borderColor: "var(--card-border)", backdropFilter: "blur(6px)" }}
    >
      <div className="mx-auto max-w-6xl flex items-center justify-between px-4 sm:px-6 py-3">
        <Link href="/" className="flex items-center gap-2 focus-ring rounded-md">
          <Image
            src="/logo.jpg"
            alt="JNHH Gaming"
            width={44}
            height={44}
            className="h-11 w-11 object-contain"
          />
          <span className="hidden sm:block display font-semibold tracking-wide text-white">
            JN HH GAMING
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm text-[var(--muted)]">
          {SOCIAL_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors focus-ring rounded"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#request"
            className="btn-pill glow-box px-5 py-2 text-sm text-white"
            style={{ background: "var(--red)" }}
          >
            Get Paid Key
          </a>
        </nav>
        <button
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="md:hidden flex flex-col gap-1.5 p-2 focus-ring rounded"
        >
          <span
            className="block h-0.5 w-6 transition-transform"
            style={{ background: "var(--red-bright)", transform: open ? "translateY(6px) rotate(45deg)" : "none" }}
          />
          <span
            className="block h-0.5 w-6 transition-opacity"
            style={{ background: "var(--red-bright)", opacity: open ? 0 : 1 }}
          />
          <span
            className="block h-0.5 w-6 transition-transform"
            style={{ background: "var(--red-bright)", transform: open ? "translateY(-6px) rotate(-45deg)" : "none" }}
          />
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t px-4 py-4 flex flex-col gap-4" style={{ borderColor: "var(--card-border)" }}>
          {SOCIAL_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--muted)] hover:text-white text-sm"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#request"
            onClick={() => setOpen(false)}
            className="btn-pill glow-box px-5 py-2 text-sm text-white text-center"
            style={{ background: "var(--red)" }}
          >
            Get Coupon
          </a>
        </div>
      )}
    </header>
  );
}
