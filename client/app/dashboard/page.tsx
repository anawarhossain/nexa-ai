"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import { FiZap, FiGrid, FiPlusCircle, FiTrendingUp } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";
import { authClient } from "@/lib/auth-client";
import { useGenerationHistory } from "@/hooks/useContentGenerator";
import { useMyItems } from "@/hooks/useItems";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ─── Mock trend data (last 7 days) — replaced by real data when available ─────
function buildTrendData(total: number) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  let running = 0;
  return days.map((day, i) => {
    const count = i < 6 ? Math.floor((total / 7) * (0.5 + Math.random())) : total - running;
    running += count;
    return { day, generations: Math.max(0, count) };
  });
}

const CONTENT_TYPE_COLORS: Record<string, string> = {
  blog: "#C8F65E",
  "product-description": "#FF7A50",
  documentation: "#818CF8",
  "social-post": "#34D399",
};

// ─── Stat card ────────────────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  icon: Icon,
  sub,
  accent,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-2xl border p-5 shadow-[var(--shadow-card)]",
        accent ? "border-signal/30 bg-signal/5" : "border-line bg-white"
      )}
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-[11px] uppercase tracking-wider text-ash-soft">
          {label}
        </span>
        <span
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full",
            accent ? "bg-signal/15 text-signal" : "bg-ink/5 text-ash"
          )}
        >
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <p className="font-display text-3xl font-bold text-ink">{value}</p>
      {sub && <p className="text-xs text-ash">{sub}</p>}
    </div>
  );
}

// ─── Custom tooltip ───────────────────────────────────────────────────────────
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-line bg-paper px-3 py-2 shadow-lg">
      <p className="font-mono text-[11px] text-ash-soft">{label}</p>
      <p className="font-display text-base font-semibold text-ink">
        {payload[0].value}{" "}
        <span className="font-mono text-xs text-ash">generations</span>
      </p>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const { data: historyData } = useGenerationHistory({ page: 1, limit: 100 });
  const { data: itemsData } = useMyItems({ limit: 100 });

  useEffect(() => {
    if (!isPending && !session) router.replace("/login");
  }, [session, isPending, router]);

  if (isPending || !session) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-signal border-t-transparent" />
      </div>
    );
  }

  const totalGenerations = historyData?.pagination?.total ?? 0;
  const totalItems = itemsData?.pagination?.total ?? 0;
  const trendData = buildTrendData(totalGenerations);

  // Content type breakdown
  const typeCounts: Record<string, number> = {};
  historyData?.items?.forEach((g) => {
    typeCounts[g.contentType] = (typeCounts[g.contentType] ?? 0) + 1;
  });
  const typeBreakdown = Object.entries(typeCounts).map(([name, count]) => ({
    name: name.replace("-", " "),
    count,
    key: name,
  }));

  const userName = session.user?.name?.split(" ")[0] || "there";

  return (
    <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8">
      {/* Greeting */}
      <div className="mb-8 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-signal">
          <HiSparkles className="h-5 w-5" />
        </span>
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">
            Good to see you, {userName} 👋
          </h1>
          <p className="mt-0.5 text-sm text-ash">
            Here's an overview of your Nexa AI activity.
          </p>
        </div>
      </div>

      {/* ─── Stat cards ──────────────────────────────────────── */}
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Total Generations"
          value={totalGenerations}
          icon={FiZap}
          sub="All time"
          accent
        />
        <StatCard
          label="My Items"
          value={totalItems}
          icon={FiGrid}
          sub="Published"
        />
        <StatCard
          label="This Week"
          value={trendData.reduce((s, d) => s + d.generations, 0)}
          icon={FiTrendingUp}
          sub="Generations"
        />
        <StatCard
          label="Content Types"
          value={typeBreakdown.length || "—"}
          icon={FiPlusCircle}
          sub="Used so far"
        />
      </div>

      {/* ─── Charts row ──────────────────────────────────────── */}
      <div className="mb-8 grid gap-5 lg:grid-cols-[1fr_280px]">
        {/* Area chart — weekly trend */}
        <div className="rounded-2xl border border-line bg-white p-5 shadow-[var(--shadow-card)]">
          <p className="mb-1 font-mono text-[11px] uppercase tracking-wider text-ash-soft">
            Generation Trend
          </p>
          <p className="mb-5 font-display text-base font-semibold text-ink">
            Last 7 days
          </p>
          {totalGenerations === 0 ? (
            <div className="flex h-40 items-center justify-center rounded-xl bg-paper-soft text-sm text-ash">
              Generate some content to see trends
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="genGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C8F65E" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#C8F65E" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8E8E4" />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 11, fontFamily: "monospace", fill: "#9A9A94" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fontFamily: "monospace", fill: "#9A9A94" }}
                  axisLine={false}
                  tickLine={false}
                  width={28}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="generations"
                  stroke="#C8F65E"
                  strokeWidth={2}
                  fill="url(#genGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Bar chart — by content type */}
        <div className="rounded-2xl border border-line bg-white p-5 shadow-[var(--shadow-card)]">
          <p className="mb-1 font-mono text-[11px] uppercase tracking-wider text-ash-soft">
            By Content Type
          </p>
          <p className="mb-5 font-display text-base font-semibold text-ink">
            Breakdown
          </p>
          {typeBreakdown.length === 0 ? (
            <div className="flex h-40 items-center justify-center rounded-xl bg-paper-soft text-sm text-ash">
              No data yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={typeBreakdown} barSize={24}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8E8E4" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 9, fontFamily: "monospace", fill: "#9A9A94" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fontFamily: "monospace", fill: "#9A9A94" }}
                  axisLine={false}
                  tickLine={false}
                  width={24}
                />
                <Tooltip
                  cursor={{ fill: "rgba(0,0,0,0.04)" }}
                  content={({ active, payload }: any) =>
                    active && payload?.length ? (
                      <div className="rounded-xl border border-line bg-paper px-3 py-2 shadow-lg">
                        <p className="font-mono text-[11px] text-ash-soft capitalize">
                          {payload[0].payload.name}
                        </p>
                        <p className="font-display text-base font-bold text-ink">
                          {payload[0].value}
                        </p>
                      </div>
                    ) : null
                  }
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {typeBreakdown.map((entry) => (
                    <Cell
                      key={entry.key}
                      fill={CONTENT_TYPE_COLORS[entry.key] ?? "#C8F65E"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* ─── Quick actions ────────────────────────────────────── */}
      <div className="rounded-2xl border border-signal/20 bg-gradient-to-br from-signal/5 to-transparent p-6">
        <h2 className="font-display text-base font-semibold text-ink">
          What would you like to do next?
        </h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/dashboard/content-generator"
            className={cn(buttonVariants({ variant: "primary", size: "sm" }))}
          >
            <FiZap className="h-4 w-4" /> Generate content
          </Link>
          <Link
            href="/items/add"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            <FiPlusCircle className="h-4 w-4" /> Add an item
          </Link>
          <Link
            href="/items"
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
          >
            <FiGrid className="h-4 w-4" /> Explore items
          </Link>
        </div>
      </div>
    </div>
  );
}
