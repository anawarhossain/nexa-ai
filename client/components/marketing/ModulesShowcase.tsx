import Link from "next/link";
import {
  PenLine,
  Briefcase,
  HeartPulse,
  Compass,
  GraduationCap,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const modules = [
  {
    icon: PenLine,
    name: "Content Generator",
    status: "live" as const,
    description:
      "Blog posts, product copy, documentation, and social posts — with adjustable length and one-click regeneration.",
    href: "/dashboard/content-generator",
  },
  {
    icon: Briefcase,
    name: "Career Coach",
    status: "soon" as const,
    description: "Resume feedback, interview prep, and role-fit analysis driven by the same agent core.",
  },
  {
    icon: HeartPulse,
    name: "Health Companion",
    status: "soon" as const,
    description: "Daily check-ins and habit tracking with agent-generated, context-aware guidance.",
  },
  {
    icon: Compass,
    name: "Travel Planner",
    status: "soon" as const,
    description: "Multi-day itineraries built step by step from your budget, dates, and interests.",
  },
  {
    icon: GraduationCap,
    name: "Learning Assistant",
    status: "soon" as const,
    description: "Structured study plans and spaced-repetition review, generated per topic.",
  },
];

export function ModulesShowcase() {
  return (
    <section id="modules" className="border-b border-line bg-paper-soft py-24 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-xl">
            <span className="font-mono text-[11px] uppercase tracking-wider text-pulse">
              Modules
            </span>
            <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              One platform, growing set of agents
            </h2>
            <p className="mt-4 text-ash">
              Every module shares the same core — auth, history, and provider
              layer. Content Generator is live today; the rest are built on
              the exact same foundation.
            </p>
          </div>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((mod) => {
            const Icon = mod.icon;
            const isLive = mod.status === "live";
            return (
              <div
                key={mod.name}
                className={cn(
                  "flex flex-col rounded-2xl border p-7 transition-shadow",
                  isLive
                    ? "border-signal/30 bg-ink text-paper shadow-[var(--shadow-card)]"
                    : "border-line bg-paper"
                )}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full",
                      isLive ? "bg-signal/15 text-signal" : "bg-ink/5 text-ash"
                    )}
                  >
                    <Icon className="h-[18px] w-[18px]" />
                  </span>
                  <span
                    className={cn(
                      "font-mono text-[10px] uppercase tracking-wider",
                      isLive ? "text-signal" : "text-ash-soft"
                    )}
                  >
                    {isLive ? "● live" : "coming soon"}
                  </span>
                </div>

                <h3 className="mt-5 font-display text-lg font-semibold">{mod.name}</h3>
                <p className={cn("mt-2 text-sm leading-relaxed", isLive ? "text-paper/70" : "text-ash")}>
                  {mod.description}
                </p>

                {isLive && mod.href && (
                  <Link
                    href={mod.href}
                    className="mt-6 inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-signal hover:gap-2.5 transition-all"
                  >
                    Open module <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
