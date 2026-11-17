"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import Calendar from "./Calendar";
import Icon from "./Icon";
import { addDays, isAvailable, niceDate, quote, saveBooking, today, unitsLeft, type Booking } from "@/lib/booking";
import { DEPOSIT, EXTRAS, SITE, UNITS, rand, type UnitId } from "@/lib/resort";
import { useStore } from "@/lib/useStore";

type Step = "stay" | "details" | "pay" | "done";
const STEPS: { id: Step; label: string }[] = [
  { id: "stay", label: "Dates & stay" },
  { id: "details", label: "Extras & details" },
  { id: "pay", label: "Deposit" },
  { id: "done", label: "Confirmed" },
];

const validDate = (s: string | null) => (s && /^\d{4}-\d{2}-\d{2}$/.test(s) && s >= today() ? s : null);

export default function BookingFlow() {
  const params = useSearchParams();
  const { bookings, rates, blocked } = useStore();

  const [checkIn, setCheckIn] = useState(() => validDate(params.get("in")) ?? addDays(today(), 7));
  const [checkOut, setCheckOut] = useState(() => {
    const out = validDate(params.get("out"));
    return out && out > checkIn ? out : addDays(checkIn, 2);
  });
  const [guests, setGuests] = useState(() => Math.min(6, Math.max(1, Number(params.get("guests")) || 2)));
  const [unitId, setUnitId] = useState<UnitId | null>(() => (UNITS.some((u) => u.id === params.get("unit")) ? (params.get("unit") as UnitId) : null));
  const [extras, setExtras] = useState<string[]>([]);
  const [step, setStep] = useState<Step>("stay");
  const [guest, setGuest] = useState({ name: "", email: "", phone: "", notes: "" });
  const [paying, setPaying] = useState(false);
  const [booking, setBooking] = useState<Booking | null>(null);

  const unit = UNITS.find((u) => u.id === unitId) ?? null;
  const datesSet = Boolean(checkIn && checkOut);
  const q = unit && datesSet ? quote(unit, checkIn, checkOut, guests, extras, rates) : null;
  const unitOk = unit && datesSet && unit.sleeps >= guests && isAvailable(unit, checkIn, checkOut, bookings, blocked);

  function pick(night: string) {
    if (!checkIn || checkOut || night <= checkIn) {
      setCheckIn(night);
      setCheckOut("");
    } else {
      setCheckOut(night);
    }
  }

  function go(next: Step) {
    setStep(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function submitDetails(e: FormEvent) {
    e.preventDefault();
    go("pay");
  }

  function pay() {
    if (!unit || !q) return;
    setPaying(true);
    // Stands in for the payment gateway (PayFast, Yoco or Peach) on a live site.
    setTimeout(() => {
      const b: Booking = {
        ref: `TL-${Math.floor(5000 + Math.random() * 4999)}`,
        unit: unit.id,
        checkIn,
        checkOut,
        guests,
        name: guest.name,
        email: guest.email,
        phone: guest.phone,
        extras,
        total: q.total,
        paid: q.deposit,
        status: "Deposit paid",
        created: today(),
      };
      saveBooking(b);
      setBooking(b);
      setPaying(false);
      go("done");
    }, 1600);
  }

  const stepIndex = STEPS.findIndex((s) => s.id === step);

  return (
    <div className="mx-auto max-w-7xl px-5 pb-24 pt-36 sm:px-8 sm:pt-40">
      <p className="eyebrow">Book your stay</p>
      <h1 className="heading mt-2">{step === "done" ? "You're booked!" : "Check availability & book"}</h1>

      <ol className="mt-8 flex flex-wrap gap-2" aria-label="Booking steps">
        {STEPS.map((s, i) => (
          <li
            key={s.id}
            aria-current={s.id === step ? "step" : undefined}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold sm:text-sm ${i === stepIndex ? "bg-bush text-white" : i < stepIndex ? "bg-moss/15 text-moss" : "bg-sand text-muted"}`}
          >
            <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] ${i === stepIndex ? "bg-clay" : i < stepIndex ? "bg-moss text-white" : "bg-white"}`}>
              {i < stepIndex ? <Icon name="check" className="h-3 w-3" /> : i + 1}
            </span>
            {s.label}
          </li>
        ))}
      </ol>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="min-w-0 space-y-6">
          {step === "stay" && (
            <>
              <section className="card p-5 sm:p-7">
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <h2 className="font-display text-2xl font-semibold">1. Choose your dates</h2>
                    <p className="mt-1 text-sm text-muted">
                      {checkIn && checkOut
                        ? `${niceDate(checkIn, { weekday: "short", day: "numeric", month: "short" })} to ${niceDate(checkOut, { weekday: "short", day: "numeric", month: "short" })}`
                        : "Tap your check-in date, then your check-out date."}
                      {unit && " · Availability shown for the " + unit.name + "."}
                    </p>
                  </div>
                  <label className="flex items-center gap-2 text-sm">
                    <Icon name="users" className="h-4 w-4 text-clay" />
                    <select value={guests} onChange={(e) => setGuests(Number(e.target.value))} className="field !w-auto !py-2" aria-label="Guests">
                      {[1, 2, 3, 4, 5, 6].map((n) => (
                        <option key={n} value={n}>
                          {n} {n === 1 ? "guest" : "guests"}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <div className="mt-5">
                  <Calendar checkIn={checkIn} checkOut={checkOut} onPick={pick} left={(n) => (unit ? unitsLeft(unit, n, bookings, blocked) : null)} />
                </div>
              </section>

              <section className="card p-5 sm:p-7">
                <h2 className="font-display text-2xl font-semibold">2. Pick your stay</h2>
                <div className="mt-5 space-y-4">
                  {UNITS.map((u) => {
                    const fits = u.sleeps >= guests;
                    const free = datesSet && isAvailable(u, checkIn, checkOut, bookings, blocked);
                    const uq = datesSet ? quote(u, checkIn, checkOut, guests, [], rates) : null;
                    const selected = u.id === unitId;
                    return (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => setUnitId(u.id)}
                        className={`flex w-full flex-col gap-4 rounded-2xl border-2 p-3 text-left transition-colors sm:flex-row sm:items-center ${selected ? "border-clay bg-clay/5" : "border-line hover:border-clay/40"}`}
                      >
                        <Image src={u.image} alt="" width={320} height={220} className="aspect-[16/10] w-full rounded-xl object-cover sm:w-40" />
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-display text-2xl font-semibold">{u.name}</span>
                            <span className="rounded-full bg-sand px-2.5 py-0.5 text-xs">Sleeps {u.sleeps}</span>
                          </div>
                          <p className="mt-1 text-sm text-muted">{u.features.join(" · ")}</p>
                          <p className={`mt-2 text-xs font-semibold ${!fits || !free ? "text-clay-deep" : "text-moss"}`}>
                            {!datesSet ? "Choose your dates" : !fits ? `Too small for ${guests} guests` : free ? "✓ Available for your dates" : "Sold out on some of your nights"}
                          </p>
                        </div>
                        <div className="shrink-0 sm:text-right">
                          {uq && (
                            <>
                              <p className="text-xl font-semibold">{rand(uq.stay)}</p>
                              <p className="text-xs text-muted">
                                {uq.nights} {uq.nights === 1 ? "night" : "nights"}
                              </p>
                            </>
                          )}
                          <span className={`mt-2 inline-flex rounded-full px-4 py-1.5 text-xs font-semibold ${selected ? "bg-clay text-white" : "bg-sand text-bush"}`}>
                            {selected ? "Selected" : "Select"}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>
            </>
          )}

          {step === "details" && unit && (
            <form onSubmit={submitDetails} className="space-y-6">
              <section className="card p-5 sm:p-7">
                <h2 className="font-display text-2xl font-semibold">Add to your stay</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {EXTRAS.map((x) => {
                    const on = extras.includes(x.id);
                    return (
                      <label key={x.id} className={`flex cursor-pointer items-start gap-3 rounded-xl border-2 p-4 transition-colors ${on ? "border-clay bg-clay/5" : "border-line hover:border-clay/40"}`}>
                        <input
                          type="checkbox"
                          checked={on}
                          onChange={() => setExtras((e) => (on ? e.filter((id) => id !== x.id) : [...e, x.id]))}
                          className="mt-1 h-4 w-4 accent-[var(--clay)]"
                        />
                        <span>
                          <span className="block font-medium">{x.name}</span>
                          <span className="text-sm text-muted">
                            {rand(x.price)} per {x.per}
                          </span>
                        </span>
                      </label>
                    );
                  })}
                </div>
              </section>
              <section className="card p-5 sm:p-7">
                <h2 className="font-display text-2xl font-semibold">Your details</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <input required value={guest.name} onChange={(e) => setGuest({ ...guest, name: e.target.value })} placeholder="Full name" autoComplete="name" className="field" />
                  <input required type="tel" value={guest.phone} onChange={(e) => setGuest({ ...guest, phone: e.target.value })} placeholder="Phone number" autoComplete="tel" className="field" />
                  <input required type="email" value={guest.email} onChange={(e) => setGuest({ ...guest, email: e.target.value })} placeholder="Email address" autoComplete="email" className="field sm:col-span-2" />
                  <textarea value={guest.notes} onChange={(e) => setGuest({ ...guest, notes: e.target.value })} rows={3} placeholder="Special requests, arrival time, dietary needs (optional)" className="field sm:col-span-2" />
                </div>
              </section>
              <div className="flex flex-wrap justify-between gap-3">
                <button type="button" onClick={() => go("stay")} className="btn-line">
                  <Icon name="left" className="h-4 w-4" /> Back
                </button>
                <button type="submit" className="btn-clay">
                  Continue to deposit <Icon name="arrow" className="h-4 w-4" />
                </button>
              </div>
            </form>
          )}

          {step === "pay" && q && (
            <section className="card overflow-hidden">
              <div className="flex items-center justify-between bg-bush px-6 py-4 text-white">
                <p className="flex items-center gap-2 font-semibold">
                  <Icon name="lock" className="h-4 w-4 text-gold" /> Secure payment
                </p>
                <p className="text-xs text-white/70">PayFast · Yoco · Peach Payments</p>
              </div>
              <div className="p-6 sm:p-8">
                <p className="text-sm text-muted">Deposit due now ({DEPOSIT * 100}%)</p>
                <p className="font-display text-5xl font-semibold">{rand(q.deposit)}</p>
                <p className="mt-2 text-sm text-muted">Balance of {rand(q.total - q.deposit)} payable on arrival.</p>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <input disabled value="4242 4242 4242 4242" aria-label="Card number" className="field sm:col-span-2" />
                  <input disabled value="12 / 29" aria-label="Expiry" className="field" />
                  <input disabled value="123" aria-label="CVV" className="field" />
                </div>
                <p className="mt-4 rounded-xl bg-gold/15 p-3 text-xs text-bush">
                  Demo mode: no money is taken. On a live website this step opens the resort&apos;s payment gateway.
                </p>
                <div className="mt-6 flex flex-wrap justify-between gap-3">
                  <button type="button" onClick={() => go("details")} className="btn-line" disabled={paying}>
                    <Icon name="left" className="h-4 w-4" /> Back
                  </button>
                  <button type="button" onClick={pay} disabled={paying} className="btn-clay">
                    {paying ? "Processing payment…" : `Pay ${rand(q.deposit)} deposit`}
                  </button>
                </div>
              </div>
            </section>
          )}

          {step === "done" && booking && unit && (
            <section className="card p-6 text-center sm:p-10">
              <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-moss text-white">
                <Icon name="check" className="h-8 w-8" />
              </span>
              <h2 className="mt-5 font-display text-4xl font-semibold">See you soon, {booking.name.split(" ")[0]}!</h2>
              <p className="mx-auto mt-3 max-w-md text-muted">
                Your booking <strong className="text-bush">{booking.ref}</strong> is confirmed and a confirmation email is on its way to {booking.email}.
              </p>
              <div className="mx-auto mt-6 max-w-sm rounded-2xl bg-sand p-5 text-left text-sm">
                <p className="flex justify-between"><span className="text-muted">Stay</span> {unit.name}</p>
                <p className="mt-1 flex justify-between"><span className="text-muted">Check-in</span> {niceDate(booking.checkIn)}, from {SITE.checkIn}</p>
                <p className="mt-1 flex justify-between"><span className="text-muted">Check-out</span> {niceDate(booking.checkOut)}, by {SITE.checkOut}</p>
                <p className="mt-1 flex justify-between"><span className="text-muted">Deposit paid</span> {rand(booking.paid)}</p>
              </div>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link href="/owner" className="btn-bush">
                  See it in the owner dashboard <Icon name="arrow" className="h-4 w-4" />
                </Link>
                <Link href="/" className="btn-line">
                  Back to home
                </Link>
              </div>
            </section>
          )}
        </div>

        {/* Summary */}
        {step !== "done" && (
          <aside className="lg:sticky lg:top-32 lg:self-start">
            <div className="card overflow-hidden">
              {unit ? (
                <Image src={unit.image} alt="" width={760} height={400} className="aspect-[19/10] w-full object-cover" />
              ) : (
                <div className="flex aspect-[19/10] items-center justify-center bg-sand text-sm text-muted">Pick a place to stay</div>
              )}
              <div className="p-6">
                <h2 className="font-display text-2xl font-semibold">{unit?.name ?? "Your stay"}</h2>
                <dl className="mt-3 space-y-1.5 text-sm">
                  <div className="flex justify-between"><dt className="text-muted">Check-in</dt><dd>{checkIn ? niceDate(checkIn) : "–"}</dd></div>
                  <div className="flex justify-between"><dt className="text-muted">Check-out</dt><dd>{checkOut ? niceDate(checkOut) : "–"}</dd></div>
                  <div className="flex justify-between"><dt className="text-muted">Guests</dt><dd>{guests}</dd></div>
                </dl>
                {q && (
                  <div className="mt-4 space-y-1.5 border-t border-line pt-4 text-sm">
                    <p className="flex justify-between">
                      <span className="text-muted">{q.nights} {q.nights === 1 ? "night" : "nights"}</span> {rand(q.stay)}
                    </p>
                    {q.extraLines.map((l) => (
                      <p key={l.name} className="flex justify-between">
                        <span className="text-muted">{l.name} × {l.qty}</span> {rand(l.amount)}
                      </p>
                    ))}
                    <p className="flex justify-between border-t border-line pt-3 text-base font-semibold">
                      Total <span>{rand(q.total)}</span>
                    </p>
                    <p className="flex justify-between font-semibold text-clay">
                      Deposit due today <span>{rand(q.deposit)}</span>
                    </p>
                  </div>
                )}
                {step === "stay" && (
                  <button type="button" disabled={!unitOk} onClick={() => go("details")} className="btn-clay mt-6 w-full">
                    {!datesSet ? "Choose your check-out date" : !unit ? "Pick a place to stay" : !unitOk ? "Not available, try other dates" : "Continue"}
                  </button>
                )}
                <p className="mt-4 flex items-start gap-2 text-xs text-muted">
                  <Icon name="check" className="h-4 w-4 shrink-0 text-moss" /> Free cancellation up to 14 days before arrival. Weekend and December holiday rates are included in the price.
                </p>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
