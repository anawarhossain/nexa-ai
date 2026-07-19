import type { Metadata } from "next";
import { Space_Grotesk, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import { QueryProvider } from "@/lib/query-provider";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["500", "600", "700"],
  display: "swap",
});

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-plex-sans",
  weight: ["400", "500", "600"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-plex-mono",
  weight: ["400", "500"],
  display: "swap",
});

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://nexa-ai.example.com";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "Nexa AI — The agentic AI platform",
    template: "%s — Nexa AI",
  },
  description:
    "Deploy AI agents that plan, draft, and refine work on their own — starting with content, expanding to your whole workflow.",
  keywords: [
    "AI content generator",
    "agentic AI",
    "prompt engineering",
    "AI writing tool",
    "Gemini AI",
    "content automation",
  ],
  authors: [{ name: "Nexa AI", url: APP_URL }],
  creator: "Nexa AI",
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: APP_URL,
    siteName: "Nexa AI",
    title: "Nexa AI — The agentic AI platform",
    description:
      "Deploy AI agents that plan, draft, and refine work on their own — starting with content, expanding to your whole workflow.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nexa AI — The agentic AI platform",
    description:
      "Deploy AI agents that plan, draft, and refine work on their own.",
    creator: "@nexaai",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${plexSans.variable} ${plexMono.variable}`}
    >
      <body className="font-body antialiased">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
