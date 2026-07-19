import type { Metadata } from "next";
import Link from "next/link";
import { FiArrowRight, FiClock, FiTag } from "react-icons/fi";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Blog — Nexa AI",
  description:
    "Insights on agentic AI, content automation, prompt engineering, and building with large language models.",
};

const posts = [
  {
    slug: "what-are-ai-agents",
    category: "Deep dive",
    title: "What are AI agents — and why do they change everything?",
    excerpt:
      "The shift from single-turn AI to multi-step agents isn't just a technical upgrade — it's a fundamental change in what software can do autonomously. We break down the architecture, the risks, and the opportunities.",
    readTime: "8 min read",
    date: "14 July 2025",
    featured: true,
  },
  {
    slug: "prompt-engineering-2025",
    category: "Tutorial",
    title: "Prompt engineering in 2025: what still matters",
    excerpt:
      "With models getting smarter, some old techniques are obsolete. But chain-of-thought, role prompting, and output constraints are more relevant than ever. Here's what to focus on.",
    readTime: "6 min read",
    date: "10 July 2025",
    featured: false,
  },
  {
    slug: "content-automation-strategy",
    category: "Strategy",
    title: "How to build a content automation strategy that doesn't feel robotic",
    excerpt:
      "The biggest mistake teams make with AI writing is treating it as a replacement rather than an amplifier. We share the framework we use internally at Nexa AI to keep content sounding human.",
    readTime: "5 min read",
    date: "3 July 2025",
    featured: false,
  },
  {
    slug: "gemini-vs-gpt4",
    category: "Comparison",
    title: "Gemini 2.0 Flash vs GPT-4o — a content creator's honest take",
    excerpt:
      "We ran 500 content generation tasks through both models and measured quality, consistency, instruction-following, and cost. Here's what we found.",
    readTime: "10 min read",
    date: "25 June 2025",
    featured: false,
  },
  {
    slug: "open-source-ai-marketplace",
    category: "Product",
    title: "Why we built an open AI resource marketplace",
    excerpt:
      "Prompts, tutorials, and tools shouldn't be locked inside Discord servers. Nexa AI Items is our attempt to create a curated, searchable home for the best community-built AI resources.",
    readTime: "4 min read",
    date: "18 June 2025",
    featured: false,
  },
];

const categoryColor: Record<string, string> = {
  "Deep dive": "bg-signal/10 text-signal",
  Tutorial: "bg-pulse/10 text-pulse",
  Strategy: "bg-ember/10 text-ember",
  Comparison: "bg-ink/8 text-ash",
  Product: "bg-paper-soft text-ash",
};

export default function BlogPage() {
  const featured = posts[0];
  const rest = posts.slice(1);

  return (
    <div className="bg-paper">
      <div className="border-b border-line bg-paper-soft px-5 py-14 sm:px-8">
        <div className="mx-auto max-w-4xl">
          <span className="font-mono text-[11px] uppercase tracking-wider text-signal">
            Insights & tutorials
          </span>
          <h1 className="mt-4 font-display text-3xl font-semibold text-ink sm:text-4xl">
            The Nexa AI Blog
          </h1>
          <p className="mt-3 max-w-xl text-ash">
            Practical insights on agentic AI, content automation, prompt
            engineering, and building with LLMs.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-5 py-12 sm:px-8">
        {/* Featured post */}
        <Link
          href={`/blog/${featured.slug}`}
          className="group mb-10 flex flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-[var(--shadow-card)] transition-shadow hover:shadow-md sm:flex-row"
        >
          <div className="flex flex-1 flex-col justify-between gap-4 p-7">
            <div>
              <span
                className={cn(
                  "inline-block rounded-full px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider",
                  categoryColor[featured.category]
                )}
              >
                {featured.category}
              </span>
              <h2 className="mt-3 font-display text-xl font-semibold leading-snug text-ink group-hover:text-signal sm:text-2xl">
                {featured.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-ash">
                {featured.excerpt}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 font-mono text-[11px] text-ash-soft">
                <FiClock className="h-3.5 w-3.5" /> {featured.readTime}
              </span>
              <span className="font-mono text-[11px] text-ash-soft">
                {featured.date}
              </span>
              <span className="ml-auto flex items-center gap-1 font-mono text-[11px] text-signal transition-all group-hover:gap-2">
                Read <FiArrowRight className="h-3.5 w-3.5" />
              </span>
            </div>
          </div>
        </Link>

        {/* Post grid */}
        <div className="grid gap-5 sm:grid-cols-2">
          {rest.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col gap-3 rounded-2xl border border-line bg-white p-6 shadow-[var(--shadow-card)] transition-shadow hover:shadow-md"
            >
              <span
                className={cn(
                  "self-start rounded-full px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider",
                  categoryColor[post.category]
                )}
              >
                {post.category}
              </span>
              <h2 className="font-display text-base font-semibold leading-snug text-ink group-hover:text-signal">
                {post.title}
              </h2>
              <p className="flex-1 text-sm leading-relaxed text-ash line-clamp-3">
                {post.excerpt}
              </p>
              <div className="flex items-center gap-3 border-t border-line pt-3">
                <span className="flex items-center gap-1 font-mono text-[11px] text-ash-soft">
                  <FiClock className="h-3 w-3" /> {post.readTime}
                </span>
                <span className="font-mono text-[11px] text-ash-soft">
                  {post.date}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
