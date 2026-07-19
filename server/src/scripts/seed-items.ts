/**
 * Sample items seed script — demo ডেটা populate করে।
 * Run: npm run seed:items
 *
 * ⚠️ শুধু demo user এর অধীনে items তৈরি হবে।
 *    demo user আগে থেকে থাকতে হবে (npm run seed:demo দিয়ে)।
 */
import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import { Item } from "../modules/items/item.model";

const DEMO_USER_ID = process.env.DEMO_USER_ID || "demo-user-id";
const DEMO_USER_NAME = "Demo User";

const sampleItems = [
  {
    title: "GPT-4 Blog Post Generator Prompt",
    shortDescription:
      "A battle-tested prompt that produces SEO-optimised blog posts with headings, tone control, and call-to-action sections.",
    fullDescription: `## Overview
This prompt template has been refined across 500+ blog post generations. It instructs the model to:

1. Open with a hook tailored to the target audience
2. Structure the article with H2/H3 headings
3. Incorporate primary and secondary keywords naturally
4. End with a clear CTA

## Usage
Replace **[TOPIC]**, **[AUDIENCE]**, and **[TONE]** with your values and paste into any GPT-4 compatible interface.

## Prompt Template
\`\`\`
You are an expert content strategist and SEO copywriter.
Write a comprehensive blog post about [TOPIC] for [AUDIENCE].
Tone: [TONE]. Length: ~1200 words. Include an engaging introduction, 4-5 H2 sections, and a conclusion with a CTA.
\`\`\`
`,
    images: [
      "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80",
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80",
    ],
    category: "Prompt",
    priority: "high",
    price: 0,
    tags: ["GPT-4", "SEO", "blog", "content-writing"],
  },
  {
    title: "Stable Diffusion — Photorealistic Portrait Workflow",
    shortDescription:
      "Step-by-step guide to generating hyper-realistic portraits with SD XL, ControlNet, and inpainting.",
    fullDescription: `## What You'll Learn
This tutorial covers the full workflow from model selection to post-processing:

- Choosing the right base checkpoint (Realistic Vision v6, DreamShaper)
- Prompt engineering for photorealistic skin, lighting, and depth
- ControlNet settings for pose and face consistency
- Inpainting to fix hands and background artefacts
- Upscaling with Ultimate SD Upscale

## Prerequisites
- Automatic1111 or ComfyUI installed
- At least 6 GB VRAM (8 GB recommended)

## Estimated Time
~45 minutes to complete the first full workflow run.
`,
    images: [
      "https://images.unsplash.com/photo-1547751946-f8bc9fd0c3f2?w=800&q=80",
      "https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?w=800&q=80",
    ],
    category: "Tutorial",
    priority: "medium",
    price: 9.99,
    tags: ["Stable Diffusion", "image-generation", "ControlNet", "portrait"],
  },
  {
    title: "AI Code Review Automation — GitHub Actions Template",
    shortDescription:
      "A ready-to-use GitHub Actions workflow that runs an LLM-powered code review on every pull request.",
    fullDescription: `## Overview
Drop this \`.github/workflows/ai-review.yml\` into any repo and get instant AI-powered code reviews on every PR.

The workflow:
1. Extracts the diff of the PR
2. Sends it to the Gemini or OpenAI API with a code-review prompt
3. Posts the feedback as a PR comment

## Setup
1. Add your \`GEMINI_API_KEY\` (or \`OPENAI_API_KEY\`) to repository secrets
2. Copy the workflow file
3. Merge to main

## Customisation
Edit the prompt in the \`review-step\` to focus on specific concerns (security, performance, style).
`,
    images: [
      "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&q=80",
    ],
    category: "Tool",
    priority: "high",
    price: 0,
    tags: ["GitHub Actions", "code-review", "automation", "DevOps"],
  },
  {
    title: "SaaS Landing Page Copy — Conversion-Optimised Template",
    shortDescription:
      "Proven copywriting framework for SaaS landing pages with hero, features, social proof, pricing, and FAQ sections.",
    fullDescription: `## What's Included
A complete copy template covering every major landing-page section:

| Section | Word Count | Purpose |
|---|---|---|
| Hero | 30–60 words | Hook + CTA above the fold |
| Problem / Solution | 80–120 words | Agitate pain, present fix |
| Features | 3–5 bullets | Specific, tangible benefits |
| Social Proof | 2–3 quotes | Build trust |
| Pricing | 2–3 tiers | Anchor + recommended plan |
| FAQ | 5–7 Q&A | Remove objections |

## Instructions
Replace all bracketed placeholders with your product specifics. Run each section through the provided refinement prompts for tone and clarity.
`,
    images: [
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
      "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&q=80",
    ],
    category: "Template",
    priority: "medium",
    price: 4.99,
    tags: ["copywriting", "SaaS", "landing-page", "marketing"],
  },
  {
    title: "LangChain Agent Patterns — Curated Resource List",
    shortDescription:
      "A curated collection of the best LangChain agent patterns, tutorials, and repositories, updated weekly.",
    fullDescription: `## Why This List?
LangChain's ecosystem moves fast. This resource aggregates the highest-signal repos, notebooks, and guides across:

- **ReAct agents** — reasoning + acting in a loop
- **Plan-and-Execute** — decompose tasks, execute sub-tasks
- **Multi-agent frameworks** — AutoGen, CrewAI integration examples
- **Memory management** — short-term (buffer), long-term (vector store)
- **Tool integration** — web search, database query, code execution

## Format
Each entry includes: direct link, difficulty level (beginner / intermediate / advanced), and a one-sentence summary.

## Update Cadence
This resource is reviewed and updated every Monday.
`,
    images: [
      "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&q=80",
    ],
    category: "Resource",
    priority: "low",
    price: 0,
    tags: ["LangChain", "agents", "RAG", "Python"],
  },
  {
    title: "Claude Sonnet — System Prompt for Customer Support",
    shortDescription:
      "A production-ready system prompt for Claude that handles tier-1 customer support with policy constraints and escalation logic.",
    fullDescription: `## Overview
This system prompt configures Claude Sonnet as a reliable, on-brand customer support agent. It includes:

- **Persona definition** — friendly, professional, concise
- **Policy guardrails** — what it can and cannot promise
- **Escalation triggers** — when to route to a human agent
- **Response format** — structured acknowledgement → solution → next-step

## Tested Scenarios
- Billing disputes
- Account access issues
- Product feature questions
- Refund requests (within and outside policy)

## Usage
Paste directly as the \`system\` parameter in the Claude API or Anthropic Console.
`,
    images: [
      "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=80",
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80",
    ],
    category: "Prompt",
    priority: "high",
    price: 2.99,
    tags: ["Claude", "customer-support", "system-prompt", "enterprise"],
  },
  {
    title: "Vector Database Comparison — Pinecone vs Weaviate vs Qdrant",
    shortDescription:
      "An objective technical comparison of the top three managed vector databases for RAG pipelines in 2025.",
    fullDescription: `## Scope
This resource evaluates Pinecone, Weaviate, and Qdrant across six dimensions:

1. **Latency** — p50 and p99 query times at 1 M and 10 M vectors
2. **Cost** — storage + query pricing at scale
3. **Filtering** — metadata filter performance (pre- vs post-filter)
4. **Hybrid search** — sparse + dense vector support
5. **Managed service quality** — uptime SLA, support, monitoring
6. **Developer experience** — SDK quality, documentation, local dev story

## Methodology
All benchmarks run on the same embedding model (text-embedding-3-small) and hardware tier.

## TL;DR Recommendation
- **Pinecone** — easiest to get started, best managed DX
- **Weaviate** — best hybrid search, strong open-source story
- **Qdrant** — best raw performance per dollar
`,
    images: [
      "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=800&q=80",
    ],
    category: "Resource",
    priority: "medium",
    price: 0,
    tags: ["RAG", "vector-database", "Pinecone", "Weaviate", "Qdrant"],
  },
  {
    title: "Next.js + AI SDK Starter Template",
    shortDescription:
      "Production-ready Next.js 14 App Router template with Vercel AI SDK, streaming responses, and auth pre-wired.",
    fullDescription: `## Stack
- **Framework**: Next.js 14 (App Router)
- **AI**: Vercel AI SDK (supports OpenAI, Anthropic, Google)
- **Auth**: NextAuth v5 (credential + Google)
- **Database**: Prisma + PostgreSQL
- **Styling**: Tailwind CSS + shadcn/ui
- **Deploy**: Vercel one-click

## Features
✅ Streaming chat UI (React Server Components + useChat)
✅ Message history persisted to DB
✅ Model switcher (GPT-4o / Claude 3.5 / Gemini 1.5)
✅ Rate limiting middleware
✅ Docker Compose for local dev

## Getting Started
Clone, copy \`.env.example\` to \`.env.local\`, add your API keys, run \`pnpm dev\`.
`,
    images: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
      "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&q=80",
    ],
    category: "Template",
    priority: "high",
    price: 14.99,
    tags: ["Next.js", "AI SDK", "TypeScript", "starter-template"],
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI!, {
    dbName: process.env.DATABASE_NAME,
  });
  console.log("✅ Connected to MongoDB");

  // Clean existing demo items
  const deleted = await Item.deleteMany({ ownerId: DEMO_USER_ID });
  console.log(`🗑️  Removed ${deleted.deletedCount} old demo items`);

  // Insert fresh items
  const docs = sampleItems.map((item) => ({
    ...item,
    ownerId: DEMO_USER_ID,
    ownerName: DEMO_USER_NAME,
  }));

  const created = await Item.insertMany(docs);
  console.log(`✅ Seeded ${created.length} items`);

  await mongoose.disconnect();
  console.log("✅ Done");
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
