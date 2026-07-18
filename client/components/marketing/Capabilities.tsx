import { LayoutTemplate, SlidersHorizontal, RefreshCw, History } from "lucide-react";

const capabilities = [
  {
    icon: LayoutTemplate,
    title: "Custom prompt templates",
    body: "Four content types — blog, product description, documentation, social post — each with its own tuned template.",
  },
  {
    icon: SlidersHorizontal,
    title: "Adjustable output length",
    body: "Short, medium, or long — set it once per request, no re-explaining what you want.",
  },
  {
    icon: RefreshCw,
    title: "One-click regenerate",
    body: "Not quite right? Regenerate with the same brief and a different pass, without losing your inputs.",
  },
  {
    icon: History,
    title: "Full generation history",
    body: "Every output is saved and searchable, so you can revisit or reuse past generations anytime.",
  },
];

export function Capabilities() {
  return (
    <section className="border-b border-line bg-paper py-24 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <span className="font-mono text-[11px] uppercase tracking-wider text-ember">
          Capabilities
        </span>
        <h2 className="mt-4 max-w-xl font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Built for actual drafting work, not demos
        </h2>

        <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {capabilities.map((cap) => {
            const Icon = cap.icon;
            return (
              <div key={cap.title}>
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-ember/15 text-ember">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 font-display text-base font-semibold">{cap.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ash">{cap.body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
