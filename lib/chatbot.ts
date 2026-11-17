import { DEPOSIT, EXTRAS, FAQS, PEAK, SITE, UNITS, rand } from "./resort";

// Built-in answers (no AI key needed). First match wins, so the more specific topics come first.
const TOPICS: { words: string[]; reply: string }[] = [
  {
    words: ["cancel", "refund"],
    reply: FAQS.find((f) => f.q.includes("cancel"))!.a,
  },
  {
    words: ["deposit", "pay", "payment", "card", "eft"],
    reply: `A ${DEPOSIT * 100}% deposit secures your booking, paid securely online when you book. The balance is paid on arrival by card or EFT.`,
  },
  {
    words: ["check-in", "check in", "checkout", "check-out", "check out", "time"],
    reply: `Check-in is from ${SITE.checkIn} and check-out is by ${SITE.checkOut}. Let us know if you need an early arrival and we'll try to help.`,
  },
  {
    words: ["child", "kid", "family", "families", "baby"],
    reply: "Families are very welcome! The Family Cottage sleeps 4 and camp stands take up to 6. Children under 3 stay free.",
  },
  {
    words: ["malaria"],
    reply: "Good news: the Waterberg is malaria-free.",
  },
  {
    words: ["where", "direction", "location", "far", "johannesburg", "pretoria"],
    reply: `We're at ${SITE.address}, about three hours' drive from Johannesburg and two and a half from Pretoria.`,
  },
  {
    words: ["drive", "safari", "game", "animal", "spa", "massage", "breakfast", "dinner", "boma", "activit", "extra"],
    reply: `You can add these when you book:\n${EXTRAS.map((e) => `• ${e.name}: ${rand(e.price)} per ${e.per}`).join("\n")}`,
  },
  {
    words: ["price", "rate", "cost", "how much", "night", "accommodation", "room", "chalet", "cottage", "treehouse", "camp"],
    reply: `Our nightly rates (Sunday to Thursday / Friday & Saturday):\n${UNITS.map((u) => `• ${u.name} (sleeps ${u.sleeps}): ${rand(u.weekday)} / ${rand(u.weekend)}`).join("\n")}\nRates go up ${PEAK.uplift * 100}% over the December holidays. The booking page shows your exact total.`,
  },
  {
    words: ["available", "availability", "book", "reserve", "dates", "free"],
    reply: "Pick your dates on the Book now page and you'll see exactly what's available, with the full price, before you pay anything.",
  },
  {
    words: ["contact", "call", "phone", "email", "whatsapp", "speak", "human"],
    reply: `You can call us on ${SITE.phone.display} or email ${SITE.email}. We reply within a few hours.`,
  },
  {
    words: ["pet", "dog"],
    reply: "Sorry, we can't allow pets because of the wildlife on the reserve.",
  },
];

export function reply(question: string): string {
  const q = question.toLowerCase();
  const hit = TOPICS.find((t) => t.words.some((w) => q.includes(w)));
  return (
    hit?.reply ??
    `Good question! I can help with rates, availability, activities, check-in times and directions. For anything else, call ${SITE.phone.display} or email ${SITE.email}.`
  );
}
