import Link from "next/link";
import Icon from "./Icon";
import { SITE } from "@/lib/resort";

export default function Footer() {
  return (
    <footer className="bg-bush text-white/75">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <p className="font-display text-3xl font-semibold text-white">{SITE.name}</p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed">
            Chalets, a treehouse, family cottages and camping in the malaria-free {SITE.area}. Just three hours from Johannesburg.
          </p>
          <Link href="/book" className="btn-clay mt-6">
            Check availability <Icon name="arrow" className="h-4 w-4" />
          </Link>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">Visit</p>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex gap-3">
              <Icon name="pin" className="mt-0.5 h-4 w-4 shrink-0 text-gold" /> {SITE.address}
            </li>
            <li className="flex gap-3">
              <Icon name="clock" className="mt-0.5 h-4 w-4 shrink-0 text-gold" /> Check-in {SITE.checkIn} · Check-out {SITE.checkOut}
            </li>
            <li className="flex gap-3">
              <Icon name="phone" className="mt-0.5 h-4 w-4 shrink-0 text-gold" /> {SITE.phone.display}
            </li>
            <li className="flex gap-3">
              <Icon name="mail" className="mt-0.5 h-4 w-4 shrink-0 text-gold" /> {SITE.email}
            </li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">Explore</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            {[
              ["/#stay", "Accommodation"],
              ["/#experiences", "Experiences"],
              ["/book", "Book your stay"],
              ["/owner", "Owner dashboard (demo)"],
              ["/credits", "Photo credits"],
            ].map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="transition-colors hover:text-white">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-7xl px-5 py-5 text-xs text-white/50 sm:px-8">
          {SITE.name} is a fictional resort. This demo website was designed and built by{" "}
          <a href={SITE.builtBy.url} className="font-semibold text-gold hover:underline">
            {SITE.builtBy.name}
          </a>
          .
        </p>
      </div>
    </footer>
  );
}
