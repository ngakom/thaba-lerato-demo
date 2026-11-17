import Image from "next/image";
import Link from "next/link";
import AvailabilitySearch from "@/components/AvailabilitySearch";
import ContactForm from "@/components/ContactForm";
import Icon, { WhatsAppIcon } from "@/components/Icon";
import { EXPERIENCES, FAQS, GALLERY, SITE, UNITS, rand } from "@/lib/resort";

const HIGHLIGHTS = [
  { value: "1 200 ha", label: "of private bushveld" },
  { value: "3 hrs", label: "from Johannesburg" },
  { value: "Big 5", label: "game drives nearby" },
  { value: "0%", label: "malaria risk" },
];

const STEPS = [
  { icon: "calendar", title: "Choose your dates", text: "See live availability for every chalet, cottage and stand." },
  { icon: "bed", title: "Pick your stay", text: "Compare prices with weekend and holiday rates worked out for you." },
  { icon: "lock", title: "Pay your deposit", text: "Secure your booking with a 50% deposit and get instant confirmation." },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[100svh] items-end overflow-hidden bg-bush pb-14 pt-40 sm:pb-20">
        <Image src="/images/hero.jpg" alt="" fill priority sizes="100vw" className="hero-zoom object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/75" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/20 to-transparent" />
        <div className="relative mx-auto w-full max-w-7xl px-5 sm:px-8">
          <p className="eyebrow fade-up !text-gold">{SITE.area}</p>
          <h1 className="display fade-up mt-4 max-w-3xl text-5xl text-white sm:text-7xl lg:text-8xl" style={{ animationDelay: "0.1s" }}>
            {SITE.tagline}
          </h1>
          <p className="fade-up mt-5 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg" style={{ animationDelay: "0.2s" }}>
            Thatched chalets, a treehouse among the marula trees, family cottages and shaded camp stands. Book your stay online in minutes.
          </p>
          <div className="fade-up mt-9 max-w-4xl" style={{ animationDelay: "0.3s" }}>
            <AvailabilitySearch />
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-8 lg:grid-cols-2 lg:items-center lg:py-28">
        <div data-reveal>
          <p className="eyebrow">Welcome to {SITE.short}</p>
          <h2 className="heading mt-3">A slower pace, a wider sky</h2>
          <p className="mt-5 leading-relaxed text-muted">
            Thaba Lerato means &ldquo;mountain of love&rdquo;. Tucked into the Waterberg hills, our family-run resort is made for long breakfasts,
            afternoon swims in the rock pool and evenings around the fire. Whether you come as a couple, a family or a group of friends, there&apos;s a
            place here for you.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-4" data-reveal-group>
            {HIGHLIGHTS.map((h) => (
              <div key={h.label} className="border-l-2 border-clay pl-4">
                <p className="font-display text-3xl font-semibold">{h.value}</p>
                <p className="mt-1 text-xs text-muted">{h.label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="relative" data-reveal>
          <Image src="/images/terrace.jpg" alt="The lodge terrace looking out over the plains" width={1920} height={1440} sizes="(min-width: 1024px) 50vw, 100vw" className="aspect-[4/3] rounded-3xl object-cover" />
          <Image src="/images/pool.jpg" alt="The resort swimming pool" width={1920} height={1440} sizes="240px" className="absolute -bottom-8 -left-4 hidden aspect-square w-48 rounded-2xl border-8 border-white object-cover shadow-xl sm:block lg:-left-10 lg:w-56" />
        </div>
      </section>

      {/* Stay */}
      <section id="stay" className="bg-sand py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="flex flex-wrap items-end justify-between gap-6" data-reveal>
            <div>
              <p className="eyebrow">Accommodation</p>
              <h2 className="heading mt-3">Find your place in the bush</h2>
            </div>
            <Link href="/book" className="btn-line">
              See availability <Icon name="arrow" className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2" data-reveal-group>
            {UNITS.map((u) => (
              <article key={u.id} className="card group overflow-hidden">
                <div className="relative aspect-[16/9] overflow-hidden">
                  <Image src={u.image} alt={u.name} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-bush">
                    Sleeps {u.sleeps}
                  </span>
                </div>
                <div className="p-6">
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="font-display text-3xl font-semibold">{u.name}</h3>
                    <p className="shrink-0 text-sm text-muted">
                      from <span className="text-lg font-semibold text-clay">{rand(u.weekday)}</span> / night
                    </p>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{u.summary}</p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {u.features.map((f) => (
                      <li key={f} className="rounded-full bg-sand px-3 py-1 text-xs font-medium text-bush/80">
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link href={`/book?unit=${u.id}`} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-clay hover:gap-3 hover:text-clay-deep">
                    Check dates & book <Icon name="arrow" className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Experiences */}
      <section id="experiences" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
        <div className="max-w-2xl" data-reveal>
          <p className="eyebrow">Experiences</p>
          <h2 className="heading mt-3">Days you&apos;ll talk about for years</h2>
          <p className="mt-4 text-muted">Add game drives, boma dinners, breakfast and spa treatments when you book, so everything is ready when you arrive.</p>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4" data-reveal-group>
          {EXPERIENCES.map((x) => (
            <article key={x.title} className="group relative aspect-[3/4] overflow-hidden rounded-2xl">
              <Image src={x.image} alt={x.title} fill sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <h3 className="font-display text-2xl font-semibold text-white">{x.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-white/80">{x.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* How booking works */}
      <section className="relative overflow-hidden bg-bush py-20 text-white lg:py-24">
        <Image src="/images/waterhole.jpg" alt="" fill sizes="100vw" className="object-cover opacity-20" />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <div className="text-center" data-reveal>
            <p className="eyebrow !text-gold">Easy online booking</p>
            <h2 className="heading mt-3">Book your stay in three steps</h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3" data-reveal-group>
            {STEPS.map((s, i) => (
              <div key={s.title} className="rounded-2xl border border-white/15 bg-white/5 p-7 backdrop-blur">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-clay">
                    <Icon name={s.icon} />
                  </span>
                  <span className="font-display text-xl text-gold">Step {i + 1}</span>
                </div>
                <h3 className="mt-5 font-display text-2xl font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/75">{s.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link href="/book" className="btn-clay">
              Start booking <Icon name="arrow" className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section id="gallery" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
        <div data-reveal>
          <p className="eyebrow">Gallery</p>
          <h2 className="heading mt-3">Life at {SITE.short}</h2>
        </div>
        <div className="mt-10 grid auto-rows-[180px] grid-cols-2 gap-4 sm:auto-rows-[220px] md:grid-cols-4" data-reveal-group>
          {GALLERY.map((g, i) => (
            <div key={g.src} className={`relative overflow-hidden rounded-2xl ${i === 0 ? "col-span-2 row-span-2" : ""} ${i === 3 || i === 5 ? "md:col-span-2" : ""}`}>
              <Image src={g.src} alt={g.alt} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover transition-transform duration-700 hover:scale-105" />
            </div>
          ))}
        </div>
      </section>

      {/* FAQ + contact */}
      <section id="contact" className="bg-sand py-20 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-2">
          <div data-reveal>
            <p className="eyebrow">Good to know</p>
            <h2 className="heading mt-3">Questions, answered</h2>
            <div className="mt-8 divide-y divide-line border-y border-line">
              {FAQS.map((f) => (
                <details key={f.q} className="group py-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium">
                    {f.q}
                    <span className="text-xl text-clay transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
          <div className="card p-6 sm:p-8" data-reveal>
            <p className="eyebrow">Contact us</p>
            <h2 className="mt-2 font-display text-3xl font-semibold">Planning a group, wedding or special stay?</h2>
            <p className="mt-2 text-sm text-muted">Send us a message and we&apos;ll get back to you within a few hours.</p>
            <ContactForm />
            <div className="mt-6 flex flex-wrap gap-3 border-t border-line pt-6 text-sm">
              <a href={`tel:${SITE.phone.tel}`} className="btn-line !py-2.5">
                <Icon name="phone" className="h-4 w-4" /> {SITE.phone.display}
              </a>
              <a href={`https://wa.me/${SITE.whatsapp}`} className="btn-line !py-2.5">
                <WhatsAppIcon className="h-4 w-4" /> WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
