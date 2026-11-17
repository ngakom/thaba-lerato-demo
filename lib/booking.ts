import { DEPOSIT, EXTRAS, PEAK, UNITS, type Unit, type UnitId } from "./resort";

// Dates are plain "YYYY-MM-DD" strings in local time, so nights never shift with time zones.
export const iso = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
export const parse = (s: string) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
};
export const addDays = (s: string, n: number) => {
  const d = parse(s);
  d.setDate(d.getDate() + n);
  return iso(d);
};
export const today = () => iso(new Date());

/** Every night of a stay: check-in up to, but not including, check-out. */
export function nightsOf(checkIn: string, checkOut: string): string[] {
  const out: string[] = [];
  for (let d = checkIn; d < checkOut; d = addDays(d, 1)) out.push(d);
  return out;
}

export const niceDate = (s: string, opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short", year: "numeric" }) =>
  parse(s).toLocaleDateString("en-ZA", opts);

const isPeak = (night: string) => {
  const md = night.slice(5);
  return md >= PEAK.from || md <= PEAK.to;
};
const isWeekend = (night: string) => [5, 6].includes(parse(night).getDay());

/* ---------- Demo storage: stands in for the database a live site would use ---------- */

export type Booking = {
  ref: string;
  unit: UnitId;
  checkIn: string;
  checkOut: string;
  guests: number;
  name: string;
  email: string;
  phone: string;
  extras: string[];
  total: number;
  paid: number;
  status: "Confirmed" | "Deposit paid" | "Checked in";
  created: string;
};

export type Rates = Record<UnitId, { weekday: number; weekend: number }>;

const KEY = { bookings: "tl-bookings", rates: "tl-rates", blocked: "tl-blocked" };

function read<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
}
function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event("tl-store"));
  } catch {
    // Private mode or storage blocked: the demo still works for this page view.
  }
}

export const defaultRates = (): Rates =>
  Object.fromEntries(UNITS.map((u) => [u.id, { weekday: u.weekday, weekend: u.weekend }])) as Rates;
export const loadRates = (): Rates => ({ ...defaultRates(), ...read<Partial<Rates>>(KEY.rates, {}) });
export const saveRates = (r: Rates) => write(KEY.rates, r);
export const resetDemo = () => {
  for (const k of Object.values(KEY)) {
    try {
      localStorage.removeItem(k);
    } catch {}
  }
  window.dispatchEvent(new Event("tl-store"));
};

export const loadBookings = (): Booking[] => read<Booking[]>(KEY.bookings, []);
export const saveBooking = (b: Booking) => write(KEY.bookings, [b, ...loadBookings()]);

/** Dates the owner has closed (e.g. maintenance), per unit type. */
export const loadBlocked = (): Record<string, string[]> => read(KEY.blocked, {});
export const toggleBlocked = (unit: UnitId, night: string) => {
  const all = loadBlocked();
  const list = new Set(all[unit] ?? []);
  if (list.has(night)) list.delete(night);
  else list.add(night);
  write(KEY.blocked, { ...all, [unit]: [...list] });
};

/* ---------- Pricing ---------- */

export function nightlyRate(unit: Unit, night: string, rates: Rates) {
  const r = rates[unit.id];
  const base = isWeekend(night) ? r.weekend : r.weekday;
  return isPeak(night) ? Math.round(base * (1 + PEAK.uplift)) : base;
}

export function quote(unit: Unit, checkIn: string, checkOut: string, guests: number, extras: string[], rates: Rates) {
  const nights = nightsOf(checkIn, checkOut);
  const stay = nights.reduce((sum, n) => sum + nightlyRate(unit, n, rates), 0);
  const extraLines = EXTRAS.filter((e) => extras.includes(e.id)).map((e) => {
    const qty = e.per === "person per night" ? guests * nights.length : e.per === "person" ? guests : 1;
    return { name: e.name, qty, amount: e.price * qty };
  });
  const total = stay + extraLines.reduce((s, l) => s + l.amount, 0);
  return { nights: nights.length, stay, extraLines, total, deposit: Math.round(total * DEPOSIT) };
}

/* ---------- Availability ---------- */

// Sample occupancy so the calendar looks like a working resort: a fixed pattern per unit type and night.
function sampleBooked(unit: Unit, night: string) {
  let h = 0;
  for (const c of unit.id + night) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  // Mix the bits so neighbouring dates get very different values.
  h ^= h >>> 13;
  h = Math.imul(h, 0x5bd1e995) >>> 0;
  h ^= h >>> 15;
  const busy = isPeak(night) ? 0.95 : isWeekend(night) ? 0.85 : 0.5;
  const share = busy + ((h % 1000) / 1000 - 0.5) * 0.5;
  return Math.max(0, Math.min(unit.count, Math.round(share * unit.count)));
}

export function unitsLeft(unit: Unit, night: string, bookings: Booking[], blocked: Record<string, string[]>) {
  if (blocked[unit.id]?.includes(night)) return 0;
  const mine = bookings.filter((b) => b.unit === unit.id && b.checkIn <= night && night < b.checkOut).length;
  return Math.max(0, unit.count - sampleBooked(unit, night) - mine);
}

export function isAvailable(unit: Unit, checkIn: string, checkOut: string, bookings: Booking[], blocked: Record<string, string[]>) {
  return nightsOf(checkIn, checkOut).every((n) => unitsLeft(unit, n, bookings, blocked) > 0);
}

/** Sample guests for the owner dashboard, spread over the coming weeks. */
export function sampleBookings(): Booking[] {
  const names = [
    ["Lerato Mokoena", "chalet", 2, 2],
    ["Pieter van Wyk", "cottage", 4, 3],
    ["Ayesha Patel", "treehouse", 2, 2],
    ["Sipho Ndlovu", "camp", 5, 2],
    ["Thandi Khumalo", "chalet", 2, 4],
    ["Johan Botha", "cottage", 3, 2],
    ["Naledi Sithole", "treehouse", 2, 3],
  ] as const;
  return names.map(([name, unit, guests, nights], i) => {
    const checkIn = addDays(today(), [0, 1, 2, 4, 6, 9, 12][i]);
    const u = UNITS.find((x) => x.id === unit)!;
    const q = quote(u, checkIn, addDays(checkIn, nights), guests, i % 2 ? ["breakfast"] : [], defaultRates());
    return {
      ref: `TL-${4120 + i * 7}`,
      unit,
      checkIn,
      checkOut: addDays(checkIn, nights),
      guests,
      name,
      email: `${name.split(" ")[0].toLowerCase()}@example.com`,
      phone: "071 000 0000",
      extras: i % 2 ? ["breakfast"] : [],
      total: q.total,
      paid: i === 0 ? q.total : q.deposit,
      status: i === 0 ? "Checked in" : "Deposit paid",
      created: addDays(today(), -10 + i),
    };
  });
}
