const steps = [
  {
    id: "01",
    title: "Analyze input",
    body: "The agent reads your topic, tone, and content type before writing a single word — so the output starts on-brief, not generic.",
  },
  {
    id: "02",
    title: "Build the prompt",
    body: "It pulls the right template — blog, product copy, docs, or social — and fills it with your specifics, not boilerplate.",
  },
  {
    id: "03",
    title: "Generate",
    body: "Gemini runs the request. The provider layer is swappable, so switching models later won't touch this step.",
  },
  {
    id: "04",
    title: "Structure & save",
    body: "Output is formatted, saved to your history, and ready to regenerate or adjust in length with one click.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-b border-line bg-paper py-24 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="max-w-xl">
          <span className="font-mono text-[11px] uppercase tracking-wider text-signal">
            How it works
          </span>
          <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            One request, four real steps
          </h2>
          <p className="mt-4 text-ash">
            No black box. Every generation goes through the same agent
            pipeline — here&apos;s exactly what happens between your click and
            the finished draft.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <div key={step.id} className="flex flex-col bg-paper p-7">
              <span className="font-mono text-sm text-signal">{step.id}</span>
              <h3 className="mt-4 font-display text-lg font-semibold">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ash">
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
