"use client";

import { useEffect, useState } from "react";
import { defaultRates, loadBlocked, loadBookings, loadRates, type Booking, type Rates } from "./booking";

/** The demo's saved bookings, rates and blocked dates, kept in sync between pages and tabs. */
export function useStore() {
  const [state, setState] = useState<{ bookings: Booking[]; rates: Rates; blocked: Record<string, string[]>; ready: boolean }>({
    bookings: [],
    rates: defaultRates(),
    blocked: {},
    ready: false,
  });

  useEffect(() => {
    const load = () => setState({ bookings: loadBookings(), rates: loadRates(), blocked: loadBlocked(), ready: true });
    load();
    window.addEventListener("tl-store", load);
    window.addEventListener("storage", load);
    return () => {
      window.removeEventListener("tl-store", load);
      window.removeEventListener("storage", load);
    };
  }, []);

  return state;
}
