import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FiArrowLeft, FiClock } from "react-icons/fi";

// Static blog content — in production this would come from a CMS/MDX
const posts: Record<
  string,
  {
    category: string;
    title: string;
    date: string;
    readTime: string;
    content: string;
  }
> = {
  "what-are-ai-agents": {
    category: "Deep dive",
    title: "What are AI agents — and why do they change everything?",
    date: "14 July 2025",
    readTime: "8 min read",
    content: `## The shift from Q&A to autonomous action

For the first two years of the generative AI boom, most products followed the same pattern: you ask a question, the model gives an answer. Useful. But fundamentally limited.

An AI agent is something different. Instead of responding to a single prompt, an agent is given a **goal** and autonomously decides what steps to take to achieve it. It can call tools, search the web, write and execute code, send emails, and — critically — check its own work.

## How agents work under the hood

At the core of any agent is a **loop**:

1. Receive a goal or task
2. Decide the next action (which tool to call, which subproblem to solve first)
3. Execute the action
4. Observe the result
5. Decide whether the goal is met — if not, repeat

This loop is driven by a large language model that acts as the "reasoning engine." The model doesn't just predict the next word — it's trained (via RLHF and instruction tuning) to plan, critique, and adapt.

## Why this changes everything

When software can act autonomously, the bottleneck for many tasks moves from "can the computer do this?" to "can I describe what I want clearly enough?"

Content generation is an obvious early example. Instead of prompting a model to write a blog post and pasting its output, an agentic system can:

- Research the topic
- Structure an outline
- Write each section independently
- Check consistency
- Revise based on tone guidelines

Nexa AI's content generator uses a 4-step pipeline that does exactly this — and the results are measurably better than single-prompt approaches.

## The risks worth taking seriously

Agents are powerful because they act autonomously. That same property makes them dangerous if poorly designed:

- **Unintended actions**: An agent given access to your email might send messages you didn't intend
- **Compounding errors**: A wrong decision early in an agent loop can cascade
- **Cost overruns**: Agents that loop indefinitely will burn API credits

Good agent design includes **guardrails**: human-in-the-loop checkpoints for high-stakes actions, token limits, and explicit success criteria.

## Where we're headed

The next 12-18 months will see agents move from demos to production systems in legal research, customer support, software development, and content operations. The companies that build reliable, auditable agentic pipelines now will have a significant head start.

At Nexa AI, we're building the infrastructure layer — starting with content, expanding to any workflow that benefits from structured, multi-step AI reasoning.`,
  },
  "prompt-engineering-2025": {
    category: "Tutorial",
    title: "Prompt engineering in 2025: what still matters",
    date: "10 July 2025",
    readTime: "6 min read",
    content: `## The techniques that survived

Prompt engineering has been declared "dead" several times as models have improved. The reality is more nuanced: some techniques are genuinely obsolete, while others are more important than ever.

## What's less important now

**Spelling out basic reasoning steps**: Older models needed explicit instruction to "think step by step." Modern models like Gemini 2.0 and GPT-4o do this by default for most tasks.

**Filler phrases**: "You are a helpful assistant" adds nothing. Models are pre-tuned to be helpful. Use that token budget on something useful.

**Extensive examples for simple tasks**: Zero-shot performance has improved dramatically. For classification, summarization, and translation, you often don't need examples.

## What matters more than ever

### Role prompting for tone and style

Telling the model *who* it is writing as — not just *what* to write — produces dramatically more consistent output. Compare:

> Write a product description for running shoes.

vs.

> You are a senior copywriter at a premium athletic brand. Your writing is confident, specific, and never uses filler superlatives. Write a product description for our new trail running shoe, the Apex 3.

The second prompt will consistently outperform the first.

### Output constraints

Explicitly defining the format you want — headers, bullet lists, JSON schema, word count — reduces hallucination and post-processing effort.

### Chain-of-thought for complex reasoning

For tasks involving multiple steps, calculations, or logical dependencies, asking the model to reason before answering still meaningfully improves accuracy.

## The new frontier: tool-use prompting

As models gain the ability to call functions and APIs, prompting has expanded to include **tool use design**: defining what tools are available, when to use them, and how to handle tool output. This is the fastest-evolving area of prompt engineering in 2025.

At Nexa AI, every content type has a carefully designed prompt template that encodes these principles — that's why our output quality is consistently higher than generic "write me a blog post" approaches.`,
  },
  "content-automation-strategy": {
    category: "Strategy",
    title: "How to build a content automation strategy that doesn't feel robotic",
    date: "3 July 2025",
    readTime: "5 min read",
    content: `## The amplifier vs. replacement mistake

Most teams deploying AI content tools make the same mistake: they treat the model as a replacement writer rather than an amplifier of a human one.

The output is technically correct but reads like it was written by someone who has read a lot of content marketing blogs and nothing else. It's competent and dull.

## The framework we use

### 1. Human defines the angle

Every piece of content starts with a human deciding on the specific angle or insight. Not "write a blog post about email marketing" but "explain why open rates are a misleading metric and what to measure instead."

The model is excellent at expanding and structuring. It's poor at deciding *what's worth saying*.

### 2. AI handles structure and first draft

Once the angle is clear, the AI generates the structure (headings, flow) and a full first draft at speed. This is where automation genuinely saves time — not in ideation but in production.

### 3. Human edits for voice and specificity

The most important edit is adding specifics: data points, examples, quotes, personal anecdotes. These are the things that make content memorable and rankable. A model can't make up real examples — and you shouldn't let it try.

### 4. Review against brand guidelines

The final step is a brand-voice check. Is the tone right? Are we making any claims we can't support?

## The outcome

Teams that follow this framework produce content 3-4x faster than traditional approaches while maintaining quality. Teams that use AI as a replacement — not an amplifier — produce content faster but at lower quality, and they eventually notice.`,
  },
  "gemini-vs-gpt4": {
    category: "Comparison",
    title: "Gemini 2.0 Flash vs GPT-4o — a content creator's honest take",
    date: "25 June 2025",
    readTime: "10 min read",
    content: `## Methodology

We ran 500 content generation tasks across 4 content types (blog posts, product descriptions, documentation, social posts) through both Gemini 2.0 Flash and GPT-4o. We rated output on quality, instruction-following, consistency, and cost.

## Quality: GPT-4o leads on nuance, Gemini on speed

For long-form content (1000+ words), GPT-4o produced more nuanced, naturally structured output. For short-form and structured output (product descriptions, social posts), Gemini 2.0 Flash was comparable and significantly faster.

**Winner by task:**
- Blog posts: GPT-4o (slight edge)
- Product descriptions: Tie
- Documentation: Gemini (better at following structure constraints)
- Social posts: Tie

## Instruction-following

Both models follow explicit instructions well. Gemini was more reliable when output format constraints were strict (e.g., "exactly 3 tweets, each under 250 characters"). GPT-4o handled ambiguous instructions more gracefully.

## Cost

At current pricing, Gemini 2.0 Flash is roughly 10x cheaper per token than GPT-4o. For high-volume content workflows, this is the deciding factor.

## Our recommendation

**Use Gemini 2.0 Flash** for high-volume, structured content generation where cost matters and instructions are explicit.

**Use GPT-4o** for lower-volume, high-stakes content where nuance and tone matter most.

Nexa AI's content generator uses Gemini 2.0 Flash as the default — the quality-to-cost ratio is excellent for the content types we support, and our prompt engineering compensates for the quality gap where it exists.`,
  },
  "open-source-ai-marketplace": {
    category: "Product",
    title: "Why we built an open AI resource marketplace",
    date: "18 June 2025",
    readTime: "4 min read",
    content: `## The problem with how AI resources are shared today

The best prompt templates, tutorials, and tool configurations live in private Discord servers, paywalled newsletters, and Twitter threads that disappear in weeks. Finding them requires knowing the right people. That's a terrible way to build a knowledge commons.

## What we built

Nexa AI Items is a searchable, categorised marketplace for community AI resources. Anyone can publish a prompt template, tutorial, tool configuration, or resource list. Anyone can search, filter, and use them.

Free items are completely free. Paid items have a transparent price. No subscriptions, no "unlock with premium."

## Why open?

We're not naive about this — we could have built a curated, closed marketplace with better unit economics. We chose open for two reasons:

**Quality improves with volume.** A closed marketplace with 100 items is less useful than an open one with 10,000, even if the open one has more noise. Filters and sorting solve the noise problem.

**Community creates defensibility.** The right way to build a lasting product in AI is to become the place where serious practitioners share their work. That only happens if we earn it by being genuinely open and useful.

## What's next

We're adding community ratings, collections, and the ability to remix and fork items. The goal is to make Nexa AI Items the GitHub for AI workflows.`,
  },
};


export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = posts[slug];
  if (!post) return { title: "Post not found" };
  return {
    title: `${post.title} — Nexa AI Blog`,
    description: post.content.slice(0, 160).replace(/[#*]/g, ""),
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = posts[slug];
  if (!post) notFound();

  // Simple markdown → HTML (## headers, paragraphs, **bold**, `code`, - list)
  function renderContent(md: string) {
    return md.split("\n\n").map((block, i) => {
      if (block.startsWith("## ")) {
        return (
          <h2
            key={i}
            className="mt-10 font-display text-xl font-semibold text-ink first:mt-0"
          >
            {block.slice(3)}
          </h2>
        );
      }
      if (block.startsWith("### ")) {
        return (
          <h3 key={i} className="mt-6 font-display text-base font-semibold text-ink">
            {block.slice(4)}
          </h3>
        );
      }
      if (block.startsWith("- ") || block.startsWith("**")) {
        const lines = block.split("\n");
        const isList = lines.every((l) => l.startsWith("- "));
        if (isList) {
          return (
            <ul key={i} className="ml-5 mt-4 list-disc space-y-1.5 text-ash">
              {lines.map((l, j) => (
                <li key={j} className="text-sm leading-relaxed">
                  {l.slice(2).replace(/\*\*(.*?)\*\*/g, "$1")}
                </li>
              ))}
            </ul>
          );
        }
      }
      if (block.startsWith("> ")) {
        return (
          <blockquote
            key={i}
            className="my-6 border-l-4 border-signal pl-4 text-sm italic text-ash"
          >
            {block.slice(2)}
          </blockquote>
        );
      }
      // Regular paragraph
      const html = block
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/`(.*?)`/g, "<code class='font-mono text-[13px] bg-paper-soft px-1.5 py-0.5 rounded'>$1</code>");
      return (
        <p
          key={i}
          className="mt-4 text-sm leading-loose text-ash"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      );
    });
  }

  return (
    <div className="bg-paper">
      {/* Header */}
      <div className="border-b border-line bg-paper-soft px-5 py-12 sm:px-8">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 font-mono text-[12px] uppercase tracking-wider text-ash-soft transition-colors hover:text-signal"
          >
            <FiArrowLeft className="h-3.5 w-3.5" /> Blog
          </Link>
          <span className="ml-4 rounded-full bg-signal/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-signal">
            {post.category}
          </span>
          <h1 className="mt-5 font-display text-2xl font-semibold leading-snug text-ink sm:text-3xl">
            {post.title}
          </h1>
          <div className="mt-4 flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-mono text-[11px] text-ash-soft">
              <FiClock className="h-3.5 w-3.5" /> {post.readTime}
            </span>
            <span className="font-mono text-[11px] text-ash-soft">
              {post.date}
            </span>
          </div>
        </div>
      </div>

      {/* Body */}
      <article className="mx-auto max-w-3xl px-5 py-12 sm:px-8">
        {renderContent(post.content)}

        <div className="mt-12 border-t border-line pt-8">
          <p className="text-sm text-ash">
            Written by the Nexa AI team · Published {post.date}
          </p>
          <Link
            href="/blog"
            className="mt-3 inline-flex items-center gap-1.5 font-mono text-[12px] uppercase tracking-wider text-signal hover:underline"
          >
            <FiArrowLeft className="h-3.5 w-3.5" /> All posts
          </Link>
        </div>
      </article>
    </div>
  );
}
