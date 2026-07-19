import type { Metadata } from "next";
import Link from "next/link";
import {
  FiBook,
  FiZap,
  FiGrid,
  FiShield,
  FiMessageSquare,
  FiChevronDown,
} from "react-icons/fi";

export const metadata: Metadata = {
  title: "Help & Support — Nexa AI",
  description:
    "Find answers to common questions about Nexa AI — content generation, items, accounts, and more.",
};

const categories = [
  { icon: FiZap, label: "Content Generator", id: "content-generator" },
  { icon: FiGrid, label: "Items & Marketplace", id: "items" },
  { icon: FiShield, label: "Account & Security", id: "account" },
  { icon: FiMessageSquare, label: "Contact & Billing", id: "billing" },
];

const faqs: { category: string; q: string; a: string }[] = [
  // Content Generator
  {
    category: "content-generator",
    q: "How does the AI content generator work?",
    a: "Nexa AI uses a 4-step agentic pipeline: (1) it analyses your brief — topic, tone, and length; (2) selects the optimal prompt template for your content type; (3) calls the Gemini 2.0 Flash model; and (4) structures and returns the output. This multi-step approach produces better results than a single-prompt approach.",
  },
  {
    category: "content-generator",
    q: "What content types are supported?",
    a: "We currently support four content types: Blog Post, Product Description, Technical Documentation, and Social Post (LinkedIn + Twitter/X thread + Instagram caption). More types are planned for future releases.",
  },
  {
    category: "content-generator",
    q: "Can I regenerate content I don't like?",
    a: "Yes — click the Regenerate button on any output. The agent will reuse your brief but generate a new response. We add a small temperature jitter so the output is meaningfully different, not just a slightly rephrased version.",
  },
  {
    category: "content-generator",
    q: "Are my generations saved?",
    a: "Yes. Every generation is saved to your account history. Visit Dashboard → Content Generator → History to see, expand, and revisit past generations.",
  },
  // Items
  {
    category: "items",
    q: "What can I publish as an item?",
    a: "Items are community-created AI resources: prompt templates, tutorials, tool configurations, templates, or curated resource lists. If it helps someone use AI better, it belongs here.",
  },
  {
    category: "items",
    q: "Can I charge for an item?",
    a: "Yes. When adding an item, set a price greater than 0. Free items have no restrictions. Note: Nexa AI is not currently handling payment processing — pricing is informational.",
  },
  {
    category: "items",
    q: "How do I edit or delete my item?",
    a: "Go to Dashboard → Manage Items. You can Quick Edit (title, priority, price) from the table/grid view, or delete an item using the delete button (which requires a confirmation).",
  },
  // Account
  {
    category: "account",
    q: "How do I log in with Google?",
    a: "Click 'Continue with Google' on the login page. You'll be redirected to Google's OAuth flow and then back to your dashboard. Make sure pop-ups are not blocked for this domain.",
  },
  {
    category: "account",
    q: "I forgot my password — what do I do?",
    a: "Password reset is coming soon. In the meantime, if you registered with email/password, you can contact support@nexa-ai.example.com. If you used Google sign-in, use that method to log in.",
  },
  {
    category: "account",
    q: "Is my data secure?",
    a: "Yes. Passwords are hashed and never stored in plain text. Sessions use secure, HttpOnly cookies. We don't share your data with third parties. Generated content is stored only in your account.",
  },
  // Billing
  {
    category: "billing",
    q: "Is Nexa AI free?",
    a: "The core platform — content generation, items browsing, account management — is completely free. Item pricing (for paid items published by community members) is set by the creator and is informational only at this stage.",
  },
  {
    category: "billing",
    q: "How do I contact support?",
    a: "Use the Contact page or email support@nexa-ai.example.com. We respond within 24 hours on business days.",
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <details className="group rounded-xl border border-line bg-white shadow-[var(--shadow-card)]">
      <summary className="flex cursor-pointer items-center justify-between gap-4 px-5 py-4 text-sm font-medium text-ink">
        {q}
        <FiChevronDown className="h-4 w-4 shrink-0 text-ash-soft transition-transform group-open:rotate-180" />
      </summary>
      <div className="border-t border-line px-5 py-4 text-sm leading-relaxed text-ash">
        {a}
      </div>
    </details>
  );
}

export default function HelpPage() {
  return (
    <div className="bg-paper">
      <div className="border-b border-line bg-paper-soft px-5 py-14 text-center sm:px-8">
        <div className="mx-auto max-w-3xl">
          <FiBook className="mx-auto mb-4 h-10 w-10 text-ash-soft" />
          <h1 className="font-display text-3xl font-semibold text-ink sm:text-4xl">
            Help Centre
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-ash">
            Answers to the most common questions about Nexa AI. Can't find what
            you need?{" "}
            <Link href="/contact" className="text-signal hover:underline">
              Contact us
            </Link>
            .
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-5 py-12 sm:px-8">
        {/* Category tabs */}
        <div className="mb-10 flex flex-wrap gap-3">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <a
                key={cat.id}
                href={`#${cat.id}`}
                className="flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-sm text-ash transition-colors hover:border-signal/40 hover:text-signal"
              >
                <Icon className="h-4 w-4" />
                {cat.label}
              </a>
            );
          })}
        </div>

        {/* FAQ sections */}
        {categories.map((cat) => {
          const catFaqs = faqs.filter((f) => f.category === cat.id);
          const Icon = cat.icon;
          return (
            <section key={cat.id} id={cat.id} className="mb-12 scroll-mt-24">
              <div className="mb-5 flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink/5">
                  <Icon className="h-4 w-4 text-ash" />
                </span>
                <h2 className="font-display text-lg font-semibold text-ink">
                  {cat.label}
                </h2>
              </div>
              <div className="space-y-3">
                {catFaqs.map((faq, i) => (
                  <FaqItem key={i} q={faq.q} a={faq.a} />
                ))}
              </div>
            </section>
          );
        })}

        {/* Still need help */}
        <div className="rounded-2xl border border-signal/20 bg-signal/5 p-8 text-center">
          <h2 className="font-display text-lg font-semibold text-ink">
            Still need help?
          </h2>
          <p className="mt-2 text-sm text-ash">
            Our support team is here for you. We respond within 24 hours.
          </p>
          <Link
            href="/contact"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-2.5 text-sm font-medium text-paper hover:bg-ink/85"
          >
            Contact support
          </Link>
        </div>
      </div>
    </div>
  );
}
