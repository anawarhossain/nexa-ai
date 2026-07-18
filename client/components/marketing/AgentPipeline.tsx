import { cn } from "@/lib/utils";

const steps = [
  { id: "01", label: "Analyze input" },
  { id: "02", label: "Build prompt" },
  { id: "03", label: "Generate" },
  { id: "04", label: "Structure output" },
];

export function AgentPipeline({
  variant = "hero",
  className,
}: {
  variant?: "hero" | "compact";
  className?: string;
}) {
  const isHero = variant === "hero";

  return (
    <div className={cn("relative w-full", className)}>
      {/* connecting line */}
      <div
        className={cn(
          "absolute left-[6%] right-[6%] top-6 h-px",
          isHero ? "bg-line-dark" : "bg-line"
        )}
      />
      {/* traveling pulse dot */}
      <div
        className="absolute top-[22px] h-2 w-2 rounded-full bg-signal shadow-[0_0_12px_2px_rgba(22,199,154,0.7)]"
        style={{
          left: "6%",
          animation: "pulse-run 4.5s cubic-bezier(0.65,0,0.35,1) infinite",
        }}
      />

      <div className="relative grid grid-cols-4 gap-2">
        {steps.map((step, i) => (
          <div key={step.id} className="flex flex-col items-center text-center">
            <div
              className={cn(
                "flex h-12 w-12 items-center justify-center rounded-full border font-mono text-xs",
                isHero
                  ? "border-line-dark bg-ink text-paper"
                  : "border-line bg-paper text-ink"
              )}
              style={{
                animation: `node-glow 4.5s ease-in-out infinite`,
                animationDelay: `${i * 1.05}s`,
              }}
            >
              {step.id}
            </div>
            <span
              className={cn(
                "mt-3 font-mono text-[11px] uppercase tracking-wider",
                isHero ? "text-paper/60" : "text-ash-soft"
              )}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes pulse-run {
          0% { left: 6%; opacity: 0; }
          5% { opacity: 1; }
          28% { left: 31.3%; }
          33% { opacity: 1; }
          52% { left: 56.6%; }
          57% { opacity: 1; }
          76% { left: 82%; }
          95% { opacity: 1; }
          100% { left: 94%; opacity: 0; }
        }
      `}</style>
    </div>
  );
}
