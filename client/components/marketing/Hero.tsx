import Link from "next/link";
import { FiArrowDown, FiArrowRight } from "react-icons/fi";
import { buttonVariants } from "@/components/ui/button";
import { AgentPipeline } from "./AgentPipeline";
import { cn } from "@/lib/utils";

export function Hero() {
  return (
    <section className="relative flex min-h-[68vh] flex-col justify-center overflow-hidden bg-ink text-paper">
      {/* subtle circuit-grid texture — reinforces the "agentic system" idea */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(var(--paper) 1px, transparent 1px), linear-gradient(90deg, var(--paper) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div
        className="pointer-events-none absolute -top-40 right-[-10%] h-96 w-96 rounded-full opacity-20 blur-[100px]"
        style={{ background: "var(--signal)" }}
      />

      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-14 px-5 py-24 sm:px-8">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-line-dark px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-signal">
            Agentic AI platform
          </span>

          <h1 className="mt-6 font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            Don&apos;t prompt it.
            <br />
            <span className="text-signal">Deploy an agent.</span>
          </h1>

          <p className="mt-6 max-w-lg text-base leading-relaxed text-paper/70 sm:text-lg">
            Nexa runs a real four-step agent behind every request — it reads your
            brief, builds the right prompt, generates, and structures the
            output. Starting with content. More modules on the way.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              href="/register"
              className={cn(buttonVariants({ variant: "accent", size: "lg" }), "group")}
            >
              Try the demo
              <FiArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/#how-it-works"
              className={cn(buttonVariants({ variant: "outline-invert", size: "lg" }))}
            >
              See how it works
            </Link>
          </div>
        </div>

        {/* signature visual: the live agent pipeline */}
        <div className="max-w-xl rounded-2xl border border-line-dark bg-white/[0.03] p-6 sm:p-8">
          <p className="mb-6 font-mono text-[11px] uppercase tracking-wider text-paper/40">
            Content Generator — request in progress
          </p>
          <AgentPipeline variant="hero" />
        </div>
      </div>

      <Link
        href="/#how-it-works"
        aria-label="Scroll to how it works"
        className="relative mx-auto mb-8 flex h-9 w-9 items-center justify-center rounded-full border border-line-dark text-paper/50 transition-colors hover:text-signal"
      >
        <FiArrowDown className="h-4 w-4" />
      </Link>
    </section>
  );
}
