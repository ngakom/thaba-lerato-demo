"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import Icon from "./Icon";
import { addDays, today } from "@/lib/booking";

/** The quick search on the home page hero: sends the dates through to the booking page. */
export default function AvailabilitySearch() {
  const router = useRouter();
  const [checkIn, setCheckIn] = useState(() => addDays(today(), 7));
  const [checkOut, setCheckOut] = useState(() => addDays(today(), 9));
  const [guests, setGuests] = useState(2);

  function submit(e: FormEvent) {
    e.preventDefault();
    router.push(`/book?in=${checkIn}&out=${checkOut}&guests=${guests}`);
  }

  const label = "mb-1 block text-[11px] font-semibold uppercase tracking-[0.2em] text-muted";
  return (
    <form onSubmit={submit} className="grid gap-3 rounded-2xl bg-white/95 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.25)] backdrop-blur sm:grid-cols-[1fr_1fr_0.7fr_auto] sm:items-end sm:p-5">
      <label>
        <span className={label}>Check-in</span>
        <input type="date" required value={checkIn} min={today()} onChange={(e) => {
          setCheckIn(e.target.value);
          if (e.target.value >= checkOut) setCheckOut(addDays(e.target.value, 1));
        }} className="field" />
      </label>
      <label>
        <span className={label}>Check-out</span>
        <input type="date" required value={checkOut} min={addDays(checkIn, 1)} onChange={(e) => setCheckOut(e.target.value)} className="field" />
      </label>
      <label>
        <span className={label}>Guests</span>
        <select value={guests} onChange={(e) => setGuests(Number(e.target.value))} className="field">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <option key={n} value={n}>
              {n} {n === 1 ? "guest" : "guests"}
            </option>
          ))}
        </select>
      </label>
      <button type="submit" className="btn-clay h-[46px]">
        <Icon name="calendar" className="h-4 w-4" /> Check availability
      </button>
    </form>
  );
}
