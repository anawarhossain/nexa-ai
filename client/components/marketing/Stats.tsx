const stats = [
  { value: "4", label: "Agent pipeline steps" },
  { value: "4", label: "Content types supported" },
  { value: "6", label: "AI providers on the roadmap" },
  { value: "1", label: "Shared core, every module" },
];

export function Stats() {
  return (
    <section className="border-b border-line-dark bg-ink py-20 text-paper">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-5 sm:px-8 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="border-l border-line-dark pl-5">
            <p className="font-mono text-3xl font-medium text-signal sm:text-4xl">
              {stat.value}
            </p>
            <p className="mt-2 text-sm text-paper/60">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
