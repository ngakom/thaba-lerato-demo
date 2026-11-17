"use client";

import { useState } from "react";
import Icon from "./Icon";
import { iso, parse, today } from "@/lib/booking";

const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

type Props = {
  checkIn: string;
  checkOut: string;
  onPick: (night: string) => void;
  /** Units still free on a night, or null when no unit type is chosen yet. */
  left: (night: string) => number | null;
};

/** Two months side by side (one on phones) for picking a check-in and check-out date. */
export default function Calendar({ checkIn, checkOut, onPick, left }: Props) {
  // The view starts at the check-in month and then only moves with the arrows, not with each pick.
  const [start] = useState(() => parse(checkIn || today()));
  const [offset, setOffset] = useState(0);
  const base = new Date(start.getFullYear(), start.getMonth() + offset, 1);
  const months = [base, new Date(base.getFullYear(), base.getMonth() + 1, 1)];
  const now = new Date();
  const canGoBack = base > new Date(now.getFullYear(), now.getMonth(), 1);

  return (
    <div>
      <div className="flex items-center justify-between">
        <button type="button" onClick={() => setOffset((o) => o - 1)} disabled={!canGoBack} aria-label="Previous month" className="rounded-full p-2 hover:bg-sand disabled:opacity-30">
          <Icon name="left" />
        </button>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-muted">
          <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-clay" /> Your stay</span>
          <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-gold/30" /> Few left</span>
          <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-sand-deep" /> Sold out</span>
        </div>
        <button type="button" onClick={() => setOffset((o) => o + 1)} aria-label="Next month" className="rounded-full p-2 hover:bg-sand">
          <Icon name="right" />
        </button>
      </div>
      <div className="mt-3 grid gap-8 md:grid-cols-2">
        {months.map((m, mi) => {
          const lead = (m.getDay() + 6) % 7;
          const days = new Date(m.getFullYear(), m.getMonth() + 1, 0).getDate();
          return (
            <div key={mi} className={mi === 1 ? "hidden md:block" : ""}>
              <p className="text-center font-display text-xl font-semibold">
                {m.toLocaleDateString("en-ZA", { month: "long", year: "numeric" })}
              </p>
              <div className="mt-3 grid grid-cols-7 gap-1 text-center">
                {WEEKDAYS.map((w) => (
                  <span key={w} className="pb-1 text-[11px] font-semibold uppercase text-muted">{w}</span>
                ))}
                {Array.from({ length: lead }, (_, i) => <span key={`b${i}`} />)}
                {Array.from({ length: days }, (_, i) => {
                  const night = iso(new Date(m.getFullYear(), m.getMonth(), i + 1));
                  const past = night < today();
                  const free = left(night);
                  const soldOut = free === 0;
                  const isEnd = night === checkIn || night === checkOut;
                  const inStay = checkIn && checkOut && night > checkIn && night < checkOut;
                  return (
                    <button
                      key={night}
                      type="button"
                      disabled={past}
                      onClick={() => onPick(night)}
                      title={soldOut ? "Sold out" : free !== null ? `${free} left` : undefined}
                      className={[
                        "relative flex aspect-square flex-col items-center justify-center rounded-lg text-sm transition-colors",
                        past ? "text-muted/30" : "hover:ring-2 hover:ring-clay/50",
                        isEnd ? "bg-clay font-semibold text-white" : inStay ? "bg-clay/15 text-bush" : soldOut && !past ? "bg-sand-deep text-muted line-through" : free !== null && free <= 1 && !past ? "bg-gold/25" : "",
                      ].join(" ")}
                    >
                      {i + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
