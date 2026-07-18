import Link from "next/link";
import { HiSparkles } from "react-icons/hi2";
import { AgentPipeline } from "@/components/marketing/AgentPipeline";
import { siteConfig } from "@/lib/site-config";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <div className="hidden flex-col justify-between bg-ink p-12 text-paper lg:flex">
        <Link href="/" className="flex items-center gap-2 font-display text-lg font-semibold">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-signal text-ink">
            <HiSparkles className="h-3.5 w-3.5" />
          </span>
          {siteConfig.name}
        </Link>

        <div>
          <p className="font-display text-3xl font-semibold leading-snug">
            &ldquo;Seeing the four-step pipeline actually run made me trust the
            output more.&rdquo;
          </p>
          <p className="mt-4 font-mono text-xs uppercase tracking-wider text-paper/50">
            Nusrat Jahan — Technical writer
          </p>
        </div>

        <div className="rounded-2xl border border-line-dark bg-white/3 p-6">
          <p className="mb-6 font-mono text-[11px] uppercase tracking-wider text-paper/40">
            Every session runs the same live agent
          </p>
          <AgentPipeline variant="hero" />
        </div>
      </div>

      <div className="flex items-center justify-center bg-paper p-6 sm:p-10">
        {children}
      </div>
    </div>
  );
}
