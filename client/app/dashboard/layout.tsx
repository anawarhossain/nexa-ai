import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";

export const metadata: Metadata = {
  title: {
    default: "Dashboard — Nexa AI",
    template: "%s — Nexa AI Dashboard",
  },
  description:
    "Your Nexa AI workspace — content generator, items management, analytics, and more.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <div className="flex min-h-[calc(100vh-64px)] bg-paper-soft">
        <DashboardSidebar />
        <main className="flex-1 overflow-x-hidden">{children}</main>
      </div>
    </>
  );
}
