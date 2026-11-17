import type { Metadata } from "next";
import OwnerDashboard from "@/components/OwnerDashboard";

export const metadata: Metadata = {
  title: "Owner dashboard (demo)",
  description: "See bookings, occupancy and rates, close dates and update prices.",
};

export default function OwnerPage() {
  return (
    <div className="bg-[#fbf8f2]">
      <OwnerDashboard />
    </div>
  );
}
