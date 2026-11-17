"use client";

import { useMemo, useState } from "react";
import Icon from "./Icon";
import { addDays, niceDate, resetDemo, sampleBookings, saveRates, toggleBlocked, today, unitsLeft, type Rates } from "@/lib/booking";
import { UNITS, rand } from "@/lib/resort";
import { useStore } from "@/lib/useStore";

const DAYS = 14;

export default function OwnerDashboard() {
  const { bookings, rates, blocked, ready } = useStore();
  const [draft, setDraft] = useState<Rates>(rates);
  const [savedRates, setSavedRates] = useState(rates);
  const [saved, setSaved] = useState(false);
  // Today is only known in the browser, so the 14-day grid waits until the saved data has loaded.
  const start = ready ? today() : "";

  // Reload the rate inputs whenever the saved rates change (e.g. after a reset).
  if (savedRates !== rates) {
    setSavedRates(rates);
    setDraft(rates);
  }

  const all = useMemo(() => [...bookings.map((b) => ({ ...b, isNew: true })), ...sampleBookings().map((b) => ({ ...b, isNew: false }))], [bookings]);
  const nights = start ? Array.from({ length: DAYS }, (_, i) => addDays(start, i)) : [];

  const capacity = UNITS.reduce((s, u) => s + u.count, 0);
  const week = nights.slice(0, 7);
  const occupied = week.reduce((s, n) => s + UNITS.reduce((t, u) => t + (u.count - unitsLeft(u, n, bookings, blocked)), 0), 0);
  const occupancy = week.length ? Math.round((occupied / (capacity * week.length)) * 100) : 0;

  const stats = [
    { label: "Arrivals today", value: String(all.filter((b) => b.checkIn === start).length), icon: "users" },
    { label: "Upcoming bookings", value: String(all.length), icon: "calendar" },
    { label: "Occupancy next 7 days", value: `${occupancy}%`, icon: "chart" },
    { label: "Deposits received", value: rand(all.reduce((s, b) => s + b.paid, 0)), icon: "lock" },
  ];

  function saveDraft() {
    saveRates(draft);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="mx-auto max-w-7xl px-5 pb-24 pt-36 sm:px-8 sm:pt-40">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Owner dashboard</p>
          <h1 className="heading mt-2">Good day, Thaba Lerato team</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted">
            Demo: on a live website this page sits behind a secure login. Try it out: book a stay, then come back here to see it arrive, or change a rate and
            watch the booking page update.
          </p>
        </div>
        <button type="button" onClick={resetDemo} className="btn-line !py-2.5 text-xs">
          Reset demo
        </button>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="card flex items-center gap-4 p-5">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-clay/10 text-clay">
              <Icon name={s.icon} className="h-6 w-6" />
            </span>
            <div>
              <p className="font-display text-3xl font-semibold leading-none">{ready ? s.value : "…"}</p>
              <p className="mt-1 text-xs text-muted">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Bookings */}
      <section className="card mt-8 overflow-hidden">
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <h2 className="font-display text-2xl font-semibold">Bookings</h2>
          <span className="text-xs text-muted">Newest first</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-sand text-xs uppercase tracking-wider text-muted">
              <tr>
                {["Ref", "Guest", "Stay", "Dates", "Guests", "Total", "Paid", "Status"].map((h) => (
                  <th key={h} className="px-5 py-3 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {all.map((b) => (
                <tr key={b.ref} className={b.isNew ? "bg-gold/10" : ""}>
                  <td className="px-5 py-3.5 font-semibold">
                    {b.ref}
                    {b.isNew && <span className="ml-2 rounded-full bg-clay px-2 py-0.5 text-[10px] font-bold uppercase text-white">New</span>}
                  </td>
                  <td className="px-5 py-3.5">
                    {b.name}
                    <span className="block text-xs text-muted">{b.email}</span>
                  </td>
                  <td className="px-5 py-3.5">{UNITS.find((u) => u.id === b.unit)?.name}</td>
                  <td className="px-5 py-3.5">
                    {niceDate(b.checkIn, { day: "numeric", month: "short" })} – {niceDate(b.checkOut, { day: "numeric", month: "short" })}
                  </td>
                  <td className="px-5 py-3.5">{b.guests}</td>
                  <td className="px-5 py-3.5">{rand(b.total)}</td>
                  <td className="px-5 py-3.5">{rand(b.paid)}</td>
                  <td className="px-5 py-3.5">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${b.status === "Checked in" ? "bg-moss/15 text-moss" : "bg-clay/10 text-clay-deep"}`}>{b.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Availability */}
      <section className="card mt-8 overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-6 py-4">
          <h2 className="font-display text-2xl font-semibold">Availability, next 14 days</h2>
          <span className="flex items-center gap-1.5 text-xs text-muted">
            <Icon name="ban" className="h-3.5 w-3.5" /> Click a day to close it (e.g. for maintenance) or open it again
          </span>
        </div>
        <div className="overflow-x-auto p-4">
          <table className="w-full min-w-[860px] border-separate border-spacing-1 text-center text-xs">
            <thead>
              <tr>
                <th className="w-36" />
                {nights.map((n) => (
                  <th key={n} className="font-medium text-muted">
                    {niceDate(n, { weekday: "short" })}
                    <span className="block text-sm font-semibold text-bush">{niceDate(n, { day: "numeric" })}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {UNITS.map((u) => (
                <tr key={u.id}>
                  <th className="pr-2 text-left text-sm font-semibold">
                    {u.name}
                    <span className="block text-[11px] font-normal text-muted">{u.count} units</span>
                  </th>
                  {nights.map((n) => {
                    const closed = blocked[u.id]?.includes(n);
                    const left = unitsLeft(u, n, bookings, blocked);
                    const tone = closed ? "bg-bush text-white" : left === 0 ? "bg-clay text-white" : left <= u.count / 3 ? "bg-gold/40" : "bg-moss/15";
                    return (
                      <td key={n}>
                        <button
                          type="button"
                          onClick={() => toggleBlocked(u.id, n)}
                          title={closed ? "Closed by owner: click to open" : "Click to close this day"}
                          className={`h-11 w-full rounded-lg font-semibold transition-transform hover:scale-105 ${tone}`}
                        >
                          {closed ? "Closed" : left === 0 ? "Full" : `${left} free`}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Rates */}
      <section className="card mt-8 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl font-semibold">Nightly rates</h2>
            <p className="text-sm text-muted">Changes show on the booking page straight away. December holiday rates add 15% automatically.</p>
          </div>
          <button type="button" onClick={saveDraft} className="btn-clay !py-2.5">
            {saved ? "Saved ✓" : "Save rates"}
          </button>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {UNITS.map((u) => (
            <div key={u.id} className="rounded-xl bg-sand p-4">
              <p className="font-semibold">{u.name}</p>
              <div className="mt-3 grid grid-cols-2 gap-3">
                {(["weekday", "weekend"] as const).map((k) => (
                  <label key={k} className="text-xs text-muted">
                    {k === "weekday" ? "Sun – Thu" : "Fri & Sat"}
                    <div className="relative mt-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-bush">R</span>
                      <input
                        type="number"
                        min={0}
                        step={50}
                        value={draft[u.id][k]}
                        onChange={(e) => setDraft({ ...draft, [u.id]: { ...draft[u.id], [k]: Number(e.target.value) } })}
                        className="field !pl-7"
                      />
                    </div>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
