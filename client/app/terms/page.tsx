import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service — Nexa AI",
  description: "Nexa AI's terms of service — your rights and responsibilities as a user.",
};

const sections = [
  {
    title: "1. Acceptance of terms",
    body: `By creating an account or using any feature of Nexa AI, you agree to these Terms of Service. If you do not agree, do not use the platform.

These terms apply to all users, including those who browse the public items marketplace without an account.`,
  },
  {
    title: "2. Eligibility",
    body: `You must be at least 13 years old to use Nexa AI. By using the platform, you represent that you meet this requirement.

If you are using Nexa AI on behalf of an organisation, you represent that you have authority to bind that organisation to these terms.`,
  },
  {
    title: "3. Your account",
    body: `You are responsible for:

- Maintaining the confidentiality of your password
- All activity that occurs under your account
- Notifying us immediately of any unauthorised access (security@nexa-ai.example.com)

You may not share your account or allow others to access the platform using your credentials. One account per person.`,
  },
  {
    title: "4. Content you create",
    body: `You retain ownership of all content you create using Nexa AI — including generated text and published items.

By publishing an item, you grant Nexa AI a non-exclusive, royalty-free licence to display, index, and distribute that item on the platform.

You are responsible for ensuring your content does not:

- Infringe third-party intellectual property rights
- Contain false, misleading, or defamatory statements
- Include malware, exploits, or harmful code
- Violate any applicable law

We reserve the right to remove content that violates these terms without prior notice.`,
  },
  {
    title: "5. Acceptable use",
    body: `You may not use Nexa AI to:

- Generate content that promotes violence, hatred, or discrimination
- Attempt to bypass rate limits, authentication, or access controls
- Scrape or bulk-download platform content without permission
- Impersonate other users or organisations
- Use the AI content generator to produce content you then misrepresent as entirely human-authored in contexts where that distinction matters (e.g., academic submissions governed by institutional AI policies)

We may suspend or terminate accounts that violate these rules.`,
  },
  {
    title: "6. AI-generated content",
    body: `Content generated using the Nexa AI content generator is produced by a large language model (Gemini 2.0 Flash). You acknowledge that:

- AI-generated content may contain inaccuracies, and you are responsible for reviewing it before publication
- Nexa AI makes no guarantee about the accuracy, originality, or fitness for purpose of generated content
- You are responsible for how you use generated content

We do not claim ownership of AI-generated output produced using your prompts.`,
  },
  {
    title: "7. Intellectual property",
    body: `Nexa AI's name, logo, codebase, and platform design are our intellectual property. You may not copy, reproduce, or create derivative works from our platform without written permission.

The items marketplace contains content owned by individual creators. Respect their ownership — don't redistribute paid items without permission.`,
  },
  {
    title: "8. Disclaimers",
    body: `Nexa AI is provided "as is" without warranty of any kind. We do not guarantee:

- Uninterrupted or error-free operation
- That generated content will meet your requirements
- That the platform will be available at any specific time

To the maximum extent permitted by applicable law, Nexa AI is not liable for any indirect, incidental, or consequential damages arising from your use of the platform.`,
  },
  {
    title: "9. Termination",
    body: `You may close your account at any time by contacting support@nexa-ai.example.com.

We may suspend or terminate your account for violations of these terms, prolonged inactivity (12+ months), or at our discretion with reasonable notice.

On termination, your access to the platform ends immediately. Publicly published items may remain visible unless you delete them before account closure.`,
  },
  {
    title: "10. Changes to these terms",
    body: `We may update these terms from time to time. We will notify you of material changes via email or an in-app notice at least 14 days before they take effect.

Continued use of Nexa AI after changes take effect constitutes acceptance of the updated terms.`,
  },
  {
    title: "11. Governing law",
    body: `These terms are governed by the laws of Bangladesh. Any disputes arising from these terms or your use of Nexa AI will be resolved in the courts of Dhaka, Bangladesh.`,
  },
  {
    title: "12. Contact",
    body: `For questions about these terms, contact:

Email: legal@nexa-ai.example.com
Address: House 14, Road 7, Dhanmondi, Dhaka 1209, Bangladesh`,
  },
];

export default function TermsPage() {
  return (
    <div className="bg-paper">
      <div className="border-b border-line bg-paper-soft px-5 py-12 sm:px-8">
        <div className="mx-auto max-w-3xl">
          <span className="font-mono text-[11px] uppercase tracking-wider text-ash-soft">
            Last updated: 14 July 2025
          </span>
          <h1 className="mt-4 font-display text-3xl font-semibold text-ink">
            Terms of Service
          </h1>
          <p className="mt-3 text-ash">
            Please read these terms carefully before using Nexa AI. By using the
            platform, you agree to be bound by them.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-5 py-12 sm:px-8">
        <div className="space-y-10">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="font-display text-lg font-semibold text-ink">
                {section.title}
              </h2>
              <div className="mt-3 space-y-3 text-sm leading-loose text-ash whitespace-pre-line">
                {section.body}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-12 border-t border-line pt-8">
          <p className="text-sm text-ash">
            Have questions?{" "}
            <Link href="/contact" className="text-signal hover:underline">
              Contact us
            </Link>{" "}
            or review our{" "}
            <Link href="/privacy" className="text-signal hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
