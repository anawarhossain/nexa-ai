"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { FiArrowRight, FiCheck } from "react-icons/fi";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function NewsletterCta() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    // TODO(Phase 5+): এখানে newsletter সাবস্ক্রিপশন API কল হবে
    setSubmitted(true);
  }

  return (
    <section className="bg-ink py-24 text-paper sm:py-28">
      <div className="mx-auto max-w-4xl px-5 text-center sm:px-8">
        <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Ready to deploy your first agent?
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-paper/70">
          Start with Content Generator today. Get a note when new modules —
          Career Coach, Health Companion, and more — go live.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/register"
            className={cn(buttonVariants({ variant: "accent", size: "lg" }), "group")}
          >
            Get started free
            <FiArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-12 flex max-w-md flex-col gap-3 border-t border-line-dark pt-10 sm:flex-row"
        >
          <label htmlFor="newsletter-email" className="sr-only">
            Email address
          </label>
          <input
            id="newsletter-email"
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-11 flex-1 rounded-full border border-line-dark bg-transparent px-5 text-sm text-paper placeholder:text-paper/40 focus:border-signal focus:outline-none"
          />
          <Button type="submit" variant="outline-invert" size="md" className="shrink-0">
            {submitted ? (
              <>
                <FiCheck className="h-4 w-4" /> Subscribed
              </>
            ) : (
              "Notify me"
            )}
          </Button>
        </form>
      </div>
    </section>
  );
}
