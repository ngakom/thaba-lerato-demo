"use client";

import { useState, type FormEvent } from "react";
import Icon from "./Icon";

/** Demo enquiry form: a live site would email the resort (e.g. through Web3Forms). */
export default function ContactForm() {
  const [sent, setSent] = useState(false);

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    e.currentTarget.reset();
    setSent(true);
  }

  if (sent)
    return (
      <div className="mt-6 flex items-start gap-3 rounded-xl bg-moss/10 p-4 text-sm text-bush">
        <Icon name="check" className="mt-0.5 h-5 w-5 shrink-0 text-moss" />
        <p>
          Thank you! Your message has been sent. <span className="text-muted">(Demo: on a live site this goes straight to the resort&apos;s inbox.)</span>
        </p>
      </div>
    );

  return (
    <form onSubmit={submit} className="mt-6 grid gap-3 sm:grid-cols-2">
      <input required name="name" placeholder="Your name" autoComplete="name" className="field" />
      <input required name="email" type="email" placeholder="Email address" autoComplete="email" className="field" />
      <textarea required name="message" rows={4} placeholder="Tell us about your stay" className="field sm:col-span-2" />
      <button type="submit" className="btn-bush sm:col-span-2">
        Send message
      </button>
    </form>
  );
}
