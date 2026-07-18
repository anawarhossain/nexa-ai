"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    q: "Which AI provider powers Nexa right now?",
    a: "Content is generated through Gemini today. The provider layer is built as a swappable interface, so OpenAI, Claude, Groq, Together AI, Ollama, and Hugging Face are planned additions without changing how you use Nexa.",
  },
  {
    q: "Is there a free way to try it?",
    a: "Yes — use the demo login on the sign-in page to auto-fill a demo account and try the Content Generator without registering.",
  },
  {
    q: "Can I edit or regenerate content after it's created?",
    a: "Every generation is saved to your history. You can regenerate with the same brief or adjust the output length without starting over.",
  },
  {
    q: "What happens to modules marked 'Coming Soon'?",
    a: "They share the same core (auth, history, provider layer) as Content Generator, so once built they roll out without requiring any changes to your account or existing data.",
  },
];

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="border-b border-line bg-paper py-24 sm:py-28">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <span className="font-mono text-[11px] uppercase tracking-wider text-signal">FAQ</span>
        <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Common questions
        </h2>

        <div className="mt-12 divide-y divide-line border-y border-line">
          {faqs.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={item.q}>
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 py-6 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="font-display text-base font-medium text-ink">
                    {item.q}
                  </span>
                  <Plus
                    className={cn(
                      "h-4 w-4 shrink-0 text-ash-soft transition-transform duration-200",
                      isOpen && "rotate-45 text-signal"
                    )}
                  />
                </button>
                <div
                  className={cn(
                    "grid overflow-hidden transition-all duration-300",
                    isOpen ? "grid-rows-[1fr] pb-6 opacity-100" : "grid-rows-[0fr] opacity-0"
                  )}
                >
                  <p className="min-h-0 text-sm leading-relaxed text-ash">{item.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
