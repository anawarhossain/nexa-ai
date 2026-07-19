import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FiTarget, FiHeart, FiGlobe, FiArrowRight } from "react-icons/fi";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "About — Nexa AI",
  description:
    "Learn about Nexa AI — our mission to make agentic AI workflows accessible to every creator and developer.",
};

const values = [
  {
    icon: FiTarget,
    title: "Precision over noise",
    body: "Every feature we ship solves a real problem. We'd rather do three things extremely well than ten things adequately.",
  },
  {
    icon: FiHeart,
    title: "Built for creators",
    body: "Content creators, developers, and marketers deserve AI that adapts to their workflow — not the other way around.",
  },
  {
    icon: FiGlobe,
    title: "Open ecosystem",
    body: "We believe the best AI experiences come from community collaboration. Our items marketplace is free and open for everyone.",
  },
];

const team = [
  {
    name: "Anawar Hossain",
    role: "Founder & Full-Stack Engineer",
    bio: "Building Nexa AI from Dhaka, Bangladesh. Passionate about agentic systems, developer tooling, and making AI genuinely useful.",
    initials: "AH",
    accent: "bg-signal",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-paper">
      {/* Hero */}
      <section className="mx-auto max-w-4xl px-5 py-24 text-center sm:px-8">
        <span className="font-mono text-[11px] uppercase tracking-wider text-signal">
          Our story
        </span>
        <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
          AI that works <br />
          the way you think
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-ash">
          Nexa AI started as a personal frustration: every AI writing tool
          produced generic output that needed just as much editing as starting
          from scratch. We built something different — an agent that understands
          context, adapts tone, and structures content the way a skilled writer
          would.
        </p>
        <Link
          href="/dashboard/content-generator"
          className={cn(buttonVariants({ variant: "accent", size: "md" }), "mt-8")}
        >
          Try the generator <FiArrowRight className="h-4 w-4" />
        </Link>
      </section>

      {/* Mission banner */}
      <section className="border-y border-line bg-ink px-5 py-14 text-center sm:px-8">
        <p className="mx-auto max-w-3xl font-display text-2xl font-semibold leading-snug text-paper sm:text-3xl">
          "Our mission is to give every creator access to agentic AI — not just
          companies with million-dollar infrastructure budgets."
        </p>
        <p className="mt-4 font-mono text-[12px] uppercase tracking-wider text-ash-soft">
          — Anawar Hossain, Founder
        </p>
      </section>

      {/* Values */}
      <section className="mx-auto max-w-5xl px-5 py-20 sm:px-8">
        <span className="font-mono text-[11px] uppercase tracking-wider text-signal">
          What we stand for
        </span>
        <h2 className="mt-4 font-display text-2xl font-semibold text-ink sm:text-3xl">
          Our values
        </h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {values.map((v) => {
            const Icon = v.icon;
            return (
              <div
                key={v.title}
                className="rounded-2xl border border-line bg-white p-7 shadow-[var(--shadow-card)]"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-signal/10 text-signal">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-display text-base font-semibold text-ink">
                  {v.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ash">{v.body}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Team */}
      <section className="border-t border-line bg-paper-soft px-5 py-20 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <span className="font-mono text-[11px] uppercase tracking-wider text-signal">
            Who we are
          </span>
          <h2 className="mt-4 font-display text-2xl font-semibold text-ink sm:text-3xl">
            The team
          </h2>
          <div className="mt-10 flex flex-wrap gap-6">
            {team.map((member) => (
              <div
                key={member.name}
                className="flex max-w-sm flex-col gap-4 rounded-2xl border border-line bg-white p-7 shadow-[var(--shadow-card)]"
              >
                <div
                  className={cn(
                    "flex h-14 w-14 items-center justify-center rounded-full font-display text-xl font-bold text-ink",
                    member.accent
                  )}
                >
                  {member.initials}
                </div>
                <div>
                  <p className="font-display font-semibold text-ink">
                    {member.name}
                  </p>
                  <p className="font-mono text-[11px] uppercase tracking-wider text-signal">
                    {member.role}
                  </p>
                </div>
                <p className="text-sm leading-relaxed text-ash">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-5 py-20 text-center sm:px-8">
        <h2 className="font-display text-2xl font-semibold text-ink">
          Ready to try Nexa AI?
        </h2>
        <p className="mt-3 text-ash">
          Create an account for free — no credit card required.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/register"
            className={cn(buttonVariants({ variant: "primary", size: "md" }))}
          >
            Get started free
          </Link>
          <Link
            href="/contact"
            className={cn(buttonVariants({ variant: "outline", size: "md" }))}
          >
            Contact us
          </Link>
        </div>
      </section>
    </div>
  );
}
