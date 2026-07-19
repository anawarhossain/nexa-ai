import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — Nexa AI",
  description: "Nexa AI's privacy policy — how we collect, use, and protect your data.",
};

const sections = [
  {
    title: "1. Information we collect",
    body: `When you create an account, we collect your name and email address. If you sign in with Google, we receive your name, email, and profile picture from Google's OAuth service — we do not receive your Google password.

When you use the content generator, we store the inputs you provide (topic, tone, length, content type) and the generated output. This data is used to power your generation history feature.

When you publish an item, we store the item's content, metadata (category, price, tags), and associate it with your user account.

We do not collect payment information. Pricing on items is currently informational only.`,
  },
  {
    title: "2. How we use your information",
    body: `We use your information to:

- Provide and maintain the Nexa AI service
- Associate your content generations and items with your account
- Send transactional emails (account verification, password reset) if applicable
- Improve the platform based on aggregate usage patterns

We do not use your content (generations, items, messages) to train AI models without explicit consent.`,
  },
  {
    title: "3. Data sharing",
    body: `We do not sell your personal data. We share data with third parties only where necessary:

- **Google OAuth**: If you choose to sign in with Google, your authentication is handled by Google
- **MongoDB Atlas**: Your data is stored on MongoDB Atlas servers (EU/US regions)
- **Gemini API**: When you generate content, your topic and configuration are sent to Google's Gemini API to generate the output

All third-party services we use are bound by their own privacy policies and data processing agreements.`,
  },
  {
    title: "4. Data retention",
    body: `We retain your account data for as long as your account is active. You may request deletion of your account and associated data at any time by contacting support@nexa-ai.example.com.

Generated content and published items remain in our database until you delete them or request account deletion. Deleted items are permanently removed and cannot be recovered.`,
  },
  {
    title: "5. Security",
    body: `We implement industry-standard security measures:

- Passwords are hashed using bcrypt (never stored in plain text)
- Sessions use secure, HttpOnly, SameSite cookies
- All data is transmitted over HTTPS
- Database access is restricted to authorised application servers only

No security system is perfect. If you discover a security vulnerability, please report it to security@nexa-ai.example.com before public disclosure.`,
  },
  {
    title: "6. Cookies",
    body: `We use a single session cookie to maintain your login state. This cookie is:

- HttpOnly (not accessible to JavaScript)
- Secure (only transmitted over HTTPS)
- Not used for advertising or third-party tracking

We do not use analytics cookies or advertising pixels.`,
  },
  {
    title: "7. Your rights",
    body: `You have the right to:

- Access the personal data we hold about you
- Correct inaccurate data
- Request deletion of your data
- Export your data in a portable format

To exercise any of these rights, contact privacy@nexa-ai.example.com. We will respond within 30 days.`,
  },
  {
    title: "8. Changes to this policy",
    body: `We may update this privacy policy to reflect changes in our practices or legal requirements. We will notify you of material changes by email or via a notice on the platform. Continued use of Nexa AI after changes take effect constitutes acceptance of the updated policy.`,
  },
  {
    title: "9. Contact",
    body: `For privacy questions or data requests, contact us at:

Email: privacy@nexa-ai.example.com
Address: House 14, Road 7, Dhanmondi, Dhaka 1209, Bangladesh`,
  },
];

export default function PrivacyPage() {
  return (
    <div className="bg-paper">
      <div className="border-b border-line bg-paper-soft px-5 py-12 sm:px-8">
        <div className="mx-auto max-w-3xl">
          <span className="font-mono text-[11px] uppercase tracking-wider text-ash-soft">
            Last updated: 14 July 2025
          </span>
          <h1 className="mt-4 font-display text-3xl font-semibold text-ink">
            Privacy Policy
          </h1>
          <p className="mt-3 text-ash">
            This policy describes how Nexa AI collects, uses, and protects your
            personal information.
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
            <Link href="/terms" className="text-signal hover:underline">
              Terms of Service
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
