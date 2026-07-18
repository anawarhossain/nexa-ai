const quotes = [
  {
    quote:
      "I stopped rewriting the same product description five times a week. Nexa's template already knows the structure I want.",
    name: "Farhana Islam",
    role: "E-commerce founder",
  },
  {
    quote:
      "The regenerate button alone saved me more time than any other AI tool I've tried this year — same brief, fresh angle.",
    name: "Tanvir Ahmed",
    role: "Content marketer",
  },
  {
    quote:
      "Seeing the four-step pipeline actually run made me trust the output more. It's not a mystery box.",
    name: "Nusrat Jahan",
    role: "Technical writer",
  },
];

export function Testimonials() {
  return (
    <section className="border-b border-line bg-paper-soft py-24 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <span className="font-mono text-[11px] uppercase tracking-wider text-pulse">
          Early users
        </span>
        <h2 className="mt-4 max-w-xl font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          What people building with Nexa say
        </h2>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {quotes.map((t) => (
            <figure
              key={t.name}
              className="flex flex-col justify-between rounded-2xl border border-line bg-paper p-7"
            >
              <blockquote className="text-[15px] leading-relaxed text-ink">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-pulse/15 font-mono text-xs text-pulse">
                  {t.name.split(" ").map((n) => n[0]).join("")}
                </span>
                <div>
                  <p className="text-sm font-medium text-ink">{t.name}</p>
                  <p className="text-xs text-ash-soft">{t.role}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
