"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FiCopy,
  FiCheck,
  FiDownload,
  FiRefreshCw,
  FiClock,
  FiZap,
  FiAlertCircle,
} from "react-icons/fi";
import { authClient } from "@/lib/auth-client";
import { useGenerate, useRegenerate } from "@/hooks/useContentGenerator";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type {
  ContentType,
  Tone,
  GenerationLength,
  Generation,
  AgentStep,
} from "@/lib/api";

// ─── Static data ──────────────────────────────────────────────────────────────

const CONTENT_TYPES: { value: ContentType; label: string; emoji: string }[] = [
  { value: "blog", label: "Blog Post", emoji: "✍️" },
  { value: "product-description", label: "Product Description", emoji: "🛍️" },
  { value: "documentation", label: "Documentation", emoji: "📄" },
  { value: "social-post", label: "Social Post", emoji: "📱" },
];

const TONES: Tone[] = [
  "Professional",
  "Casual",
  "Creative",
  "Technical",
  "Persuasive",
];

const LENGTHS: { value: GenerationLength; label: string; words: string }[] = [
  { value: "short", label: "Short", words: "~300 words" },
  { value: "medium", label: "Medium", words: "~600 words" },
  { value: "long", label: "Long", words: "~1000 words" },
];

// ─── Agent pipeline visual ────────────────────────────────────────────────────

const PIPELINE_STEPS = [
  "Analysing request",
  "Building prompt",
  "Calling AI model",
  "Structuring output",
];

function AgentPipelineLoader({ activeStep }: { activeStep: number }) {
  return (
    <div className="space-y-3">
      {PIPELINE_STEPS.map((label, i) => {
        const done = i < activeStep;
        const active = i === activeStep;
        return (
          <div key={label} className="flex items-center gap-3">
            <div
              className={cn(
                "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-[11px] font-mono font-semibold transition-all duration-500",
                done
                  ? "border-signal bg-signal text-ink"
                  : active
                  ? "border-signal bg-signal/10 text-signal animate-pulse"
                  : "border-line bg-paper text-ash-soft"
              )}
            >
              {done ? "✓" : i + 1}
            </div>
            <span
              className={cn(
                "font-mono text-[12px] uppercase tracking-wider transition-colors",
                done
                  ? "text-signal"
                  : active
                  ? "text-ink"
                  : "text-ash-soft"
              )}
            >
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Output panel ─────────────────────────────────────────────────────────────

function OutputPanel({
  generation,
  onRegenerate,
  isRegenerating,
}: {
  generation: Generation;
  onRegenerate: () => void;
  isRegenerating: boolean;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(generation.generatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleDownload() {
    const blob = new Blob([generation.generatedText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `nexa-${generation.contentType}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Meta bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-signal/10 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-signal">
            {generation.contentType}
          </span>
          <span className="font-mono text-[11px] text-ash-soft">
            {generation.wordCount} words
          </span>
          <span className="font-mono text-[11px] text-ash-soft">
            {generation.tone}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="copy-output-btn"
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-ash transition-colors hover:text-signal"
          >
            {copied ? (
              <>
                <FiCheck className="h-3.5 w-3.5 text-signal" /> Copied!
              </>
            ) : (
              <>
                <FiCopy className="h-3.5 w-3.5" /> Copy
              </>
            )}
          </button>

          <button
            id="download-output-btn"
            onClick={handleDownload}
            className="flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-ash transition-colors hover:text-signal"
          >
            <FiDownload className="h-3.5 w-3.5" /> Download
          </button>

          <button
            id="regenerate-btn"
            onClick={onRegenerate}
            disabled={isRegenerating}
            className="flex items-center gap-1.5 rounded-full border border-signal bg-signal/10 px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-signal transition-colors hover:bg-signal/20 disabled:opacity-50"
          >
            <FiRefreshCw
              className={cn("h-3.5 w-3.5", isRegenerating && "animate-spin")}
            />
            {isRegenerating ? "Regenerating…" : "Regenerate"}
          </button>
        </div>
      </div>

      {/* Generated text */}
      <div className="rounded-2xl border border-line bg-white p-6 shadow-[var(--shadow-card)]">
        <pre className="whitespace-pre-wrap font-body text-sm leading-relaxed text-ink">
          {generation.generatedText}
        </pre>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function ContentGeneratorPage() {
  const router = useRouter();
  const { data: session, isPending: authPending } = authClient.useSession();

  // Form state
  const [contentType, setContentType] = useState<ContentType>("blog");
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState<Tone>("Professional");
  const [length, setLength] = useState<GenerationLength>("medium");

  // Result state
  const [generation, setGeneration] = useState<Generation | null>(null);
  const [steps, setSteps] = useState<AgentStep[]>([]);
  const [activeStep, setActiveStep] = useState(-1);

  const generate = useGenerate();
  const regenerate = useRegenerate();

  // Auth guard
  useEffect(() => {
    if (!authPending && !session) router.replace("/login");
  }, [session, authPending, router]);

  // Animate step progression while loading
  useEffect(() => {
    if (!generate.isPending && !regenerate.isPending) {
      setActiveStep(-1);
      return;
    }
    setActiveStep(0);
    const timers = [1, 2, 3].map((i) =>
      setTimeout(() => setActiveStep(i), i * 1800)
    );
    return () => timers.forEach(clearTimeout);
  }, [generate.isPending, regenerate.isPending]);

  async function handleGenerate() {
    if (!topic.trim()) return;
    setGeneration(null);
    const result = await generate.mutateAsync({
      contentType,
      topic: topic.trim(),
      tone,
      length,
    });
    setGeneration(result.generation);
    setSteps(result.steps);
  }

  async function handleRegenerate() {
    if (!generation) return;
    setGeneration(null);
    const result = await regenerate.mutateAsync(generation._id);
    setGeneration(result.generation);
    setSteps(result.steps);
  }

  const isLoading = generate.isPending || regenerate.isPending;
  const error = generate.error || regenerate.error;

  if (authPending) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-signal border-t-transparent" />
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
      {/* Header */}
      <div className="mb-10 flex items-start justify-between">
        <div>
          <span className="font-mono text-[11px] uppercase tracking-wider text-signal">
            ● Live module
          </span>
          <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            AI Content Generator
          </h1>
          <p className="mt-2 text-sm text-ash">
            A four-step agent analyses your brief, builds the optimal prompt,
            generates, and structures the output.
          </p>
        </div>
        <Link
          href="/dashboard/content-generator/history"
          className="hidden items-center gap-2 rounded-full border border-line bg-white px-4 py-2 font-mono text-[12px] uppercase tracking-wider text-ash transition-colors hover:text-ink sm:flex"
          id="view-history-link"
        >
          <FiClock className="h-3.5 w-3.5" /> History
        </Link>
      </div>

      <div className="grid gap-10 lg:grid-cols-[380px_1fr]">
        {/* ─── Left: Form ──────────────────────────────────────── */}
        <div className="space-y-6">
          {/* Content type */}
          <div>
            <label className="mb-3 block font-mono text-[11px] uppercase tracking-wider text-ash-soft">
              Content type
            </label>
            <div className="grid grid-cols-2 gap-2">
              {CONTENT_TYPES.map((ct) => (
                <button
                  key={ct.value}
                  id={`content-type-${ct.value}`}
                  onClick={() => setContentType(ct.value)}
                  className={cn(
                    "flex items-center gap-2 rounded-xl border p-3 text-left text-sm transition-all",
                    contentType === ct.value
                      ? "border-signal bg-signal/5 text-ink"
                      : "border-line bg-white text-ash hover:border-signal/30"
                  )}
                >
                  <span className="text-base">{ct.emoji}</span>
                  <span className="font-medium">{ct.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Topic */}
          <div>
            <label
              htmlFor="topic-input"
              className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-ash-soft"
            >
              Topic / Brief
            </label>
            <textarea
              id="topic-input"
              rows={3}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder={
                contentType === "blog"
                  ? "e.g. How LangChain agents work"
                  : contentType === "product-description"
                  ? "e.g. AI-powered writing assistant for developers"
                  : contentType === "documentation"
                  ? "e.g. Setting up Prisma with Next.js 14"
                  : "e.g. Launch of our new AI productivity platform"
              }
              className="w-full resize-none rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink placeholder:text-ash-soft focus:outline-none focus:ring-2 focus:ring-signal/40"
            />
          </div>

          {/* Tone */}
          <div>
            <label className="mb-3 block font-mono text-[11px] uppercase tracking-wider text-ash-soft">
              Tone
            </label>
            <div className="flex flex-wrap gap-2">
              {TONES.map((t) => (
                <button
                  key={t}
                  id={`tone-${t.toLowerCase()}`}
                  onClick={() => setTone(t)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-all",
                    tone === t
                      ? "border-signal bg-signal text-ink"
                      : "border-line bg-white text-ash hover:border-signal/40"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Length */}
          <div>
            <label className="mb-3 block font-mono text-[11px] uppercase tracking-wider text-ash-soft">
              Length
            </label>
            <div className="grid grid-cols-3 gap-2">
              {LENGTHS.map((l) => (
                <button
                  key={l.value}
                  id={`length-${l.value}`}
                  onClick={() => setLength(l.value)}
                  className={cn(
                    "flex flex-col items-center rounded-xl border py-3 transition-all",
                    length === l.value
                      ? "border-signal bg-signal/5"
                      : "border-line bg-white hover:border-signal/30"
                  )}
                >
                  <span
                    className={cn(
                      "text-sm font-semibold",
                      length === l.value ? "text-ink" : "text-ash"
                    )}
                  >
                    {l.label}
                  </span>
                  <span className="mt-0.5 font-mono text-[10px] text-ash-soft">
                    {l.words}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Generate button */}
          <Button
            id="generate-btn"
            variant="primary"
            size="md"
            className="w-full gap-2"
            onClick={handleGenerate}
            disabled={isLoading || !topic.trim()}
          >
            <FiZap className="h-4 w-4" />
            {isLoading ? "Generating…" : "Generate"}
          </Button>
        </div>

        {/* ─── Right: Output ─────────────────────────────────── */}
        <div className="min-h-[400px]">
          {isLoading ? (
            /* Loading — pipeline animation */
            <div className="rounded-2xl border border-signal/20 bg-signal/5 p-8">
              <p className="mb-6 font-mono text-[11px] uppercase tracking-wider text-signal">
                Agent running — {PIPELINE_STEPS[Math.max(0, activeStep)]}
              </p>
              <AgentPipelineLoader activeStep={activeStep} />
              <p className="mt-6 text-sm text-ash">
                This usually takes 5–15 seconds depending on length.
              </p>
            </div>
          ) : error ? (
            /* Error state */
            <div className="flex items-start gap-3 rounded-2xl border border-ember/30 bg-ember/5 p-6">
              <FiAlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-ember" />
              <div>
                <p className="font-medium text-ink">Generation failed</p>
                <p className="mt-1 text-sm text-ash">
                  {(error as any)?.response?.data?.message ??
                    "Something went wrong. Please try again."}
                </p>
              </div>
            </div>
          ) : generation ? (
            /* Output */
            <OutputPanel
              generation={generation}
              onRegenerate={handleRegenerate}
              isRegenerating={regenerate.isPending}
            />
          ) : (
            /* Empty state */
            <div className="flex h-full min-h-[400px] flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-paper-soft/50 p-10 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-ink/5">
                <FiZap className="h-6 w-6 text-ash-soft" />
              </div>
              <p className="mt-4 font-display text-base font-semibold text-ink">
                Ready to generate
              </p>
              <p className="mt-2 max-w-xs text-sm text-ash">
                Fill in the form on the left, then click Generate to run the
                agent pipeline.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
