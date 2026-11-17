"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Icon from "./Icon";
import { SITE } from "@/lib/resort";

const NAV = [
  { href: "/#stay", label: "Stay" },
  { href: "/#experiences", label: "Experiences" },
  { href: "/#gallery", label: "Gallery" },
  { href: "/#contact", label: "Contact" },
  { href: "/owner", label: "Owner dashboard" },
];

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  // Only the home page has a full-bleed photo for the header to sit on.
  const solid = scrolled || open || pathname !== "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-40">
      <p className="bg-bush px-4 py-1.5 text-center text-[11px] text-white/80 sm:text-xs">
        Demo resort website by{" "}
        <a href={SITE.builtBy.url} className="font-semibold text-gold underline-offset-2 hover:underline">
          {SITE.builtBy.name}
        </a>{" "}
        · no real bookings or payments
      </p>
      <div className={`transition-colors duration-300 ${solid ? "bg-white/95 shadow-[0_6px_24px_rgba(30,42,34,0.08)] backdrop-blur" : "bg-transparent"}`}>
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-6 px-5 py-3 sm:px-8">
          <Link href="/" className={`flex items-center gap-3 ${solid ? "text-bush" : "text-white"}`}>
            <svg viewBox="0 0 40 40" className="h-10 w-10" aria-hidden="true">
              <circle cx="20" cy="20" r="19" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="27" cy="13" r="4" fill="#d9a441" />
              <path d="M5 28 14 17l6 7 5-5 10 9" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
            </svg>
            <span className="leading-none">
              <span className="block font-display text-2xl font-semibold">{SITE.short}</span>
              <span className={`block text-[10px] uppercase tracking-[0.3em] ${solid ? "text-muted" : "text-white/75"}`}>Bush Resort</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-7 lg:flex" aria-label="Main">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className={`text-sm font-medium transition-colors ${solid ? "text-bush/80 hover:text-clay" : "text-white/90 hover:text-white"} ${pathname === n.href ? "text-clay" : ""}`}
              >
                {n.label}
              </Link>
            ))}
            <Link href="/book" className="btn-clay !px-6 !py-2.5">
              Book now
            </Link>
          </nav>

          <div className="flex items-center gap-2 lg:hidden">
            <Link href="/book" className="btn-clay !px-5 !py-2 text-xs">
              Book
            </Link>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className={`rounded-full p-2 ${solid ? "text-bush" : "text-white"}`}
            >
              <Icon name={open ? "x" : "menu"} className="h-6 w-6" />
            </button>
          </div>
        </div>
        {open && (
          <nav className="border-t border-line bg-white px-5 pb-5 lg:hidden" aria-label="Mobile">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} onClick={() => setOpen(false)} className="block border-b border-line py-3.5 text-base font-medium text-bush">
                {n.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
