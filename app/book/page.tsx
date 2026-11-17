import type { Metadata } from "next";
import { Suspense } from "react";
import BookingFlow from "@/components/BookingFlow";

export const metadata: Metadata = {
  title: "Book your stay",
  description: "Check live availability, see your exact price and book with a 50% deposit.",
};

export default function BookPage() {
  return (
    <div className="bg-[#fffdf9]">
      <Suspense>
        <BookingFlow />
      </Suspense>
    </div>
  );
}
