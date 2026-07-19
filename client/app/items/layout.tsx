import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Explore Items — Nexa AI",
  description:
    "Browse community-created AI resources: prompt templates, tutorials, tools, and templates. Free and paid items for every use case.",
};

export default function ItemsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
