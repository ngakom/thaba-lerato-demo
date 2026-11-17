import type { Metadata } from "next";
import { PHOTO_CREDITS } from "@/lib/resort";

export const metadata: Metadata = { title: "Photo credits" };

export default function CreditsPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 pb-24 pt-40 sm:px-8">
      <p className="eyebrow">Photo credits</p>
      <h1 className="heading mt-2">Photography</h1>
      <p className="mt-4 text-sm text-muted">
        The photos on this demo site come from Wikimedia Commons and are used under their Creative Commons licences. They show real South African places and are
        used here only to illustrate a fictional resort.
      </p>
      <ul className="mt-8 divide-y divide-line border-y border-line text-sm">
        {PHOTO_CREDITS.map((c) => (
          <li key={c.file} className="flex flex-wrap justify-between gap-2 py-3">
            <span className="font-medium">{c.file}</span>
            <span className="text-muted">
              by{" "}
              <a href={c.page} className="text-clay underline-offset-2 hover:underline" rel="noopener noreferrer" target="_blank">
                {c.author}
              </a>
              , {c.license}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
