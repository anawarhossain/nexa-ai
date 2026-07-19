"use client";

import { useState } from "react";
import Link from "next/link";

import {
  FiMail,
  FiMapPin,
  FiClock,
  FiSend,
  FiCheck,
  FiAlertCircle,
} from "react-icons/fi";

const contactInfo = [
  {
    icon: FiMail,
    label: "Email",
    value: "hello@nexa-ai.example.com",
    href: "mailto:hello@nexa-ai.example.com",
  },
  {
    icon: FiMapPin,
    label: "Location",
    value: "Dhaka, Bangladesh",
    href: null,
  },
  {
    icon: FiClock,
    label: "Response time",
    value: "Within 24 hours",
    href: null,
  },
];

type FormState = "idle" | "loading" | "success" | "error";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("General inquiry");
  const [message, setMessage] = useState("");
  const [state, setState] = useState<FormState>("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;
    setState("loading");
    // Simulate submission (real integration: send to an API route or EmailJS)
    await new Promise((r) => setTimeout(r, 1500));
    setState("success");
  }

  const inputClass =
    "h-11 w-full rounded-xl border border-line bg-white px-4 text-sm text-ink placeholder:text-ash-soft focus:outline-none focus:ring-2 focus:ring-signal/40";

  return (
    <div className="bg-paper">
      {/* Header */}
      <div className="border-b border-line bg-paper-soft px-5 py-14 sm:px-8">
        <div className="mx-auto max-w-4xl">
          <span className="font-mono text-[11px] uppercase tracking-wider text-signal">
            Get in touch
          </span>
          <h1 className="mt-4 font-display text-3xl font-semibold text-ink sm:text-4xl">
            Contact us
          </h1>
          <p className="mt-3 max-w-xl text-ash">
            Have a question, idea, or partnership proposal? We'd love to hear
            from you. Fill in the form or reach out directly.
          </p>
        </div>
      </div>

      <div className="mx-auto grid max-w-4xl gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[280px_1fr]">
        {/* Contact info */}
        <div className="space-y-6">
          {contactInfo.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex gap-3">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink/5 text-ash">
                  <Icon className="h-4 w-4" />
                </span>
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-wider text-ash-soft">
                    {item.label}
                  </p>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="mt-0.5 text-sm text-ink hover:text-signal hover:underline"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className="mt-0.5 text-sm text-ink">{item.value}</p>
                  )}
                </div>
              </div>
            );
          })}

          <div className="border-t border-line pt-4">
            <p className="font-mono text-[11px] uppercase tracking-wider text-ash-soft">
              Support
            </p>
            <Link
              href="/help"
              className="mt-1.5 inline-block text-sm text-signal hover:underline"
            >
              Visit our Help Centre →
            </Link>
          </div>
        </div>

        {/* Form */}
        <div className="rounded-2xl border border-line bg-white p-7 shadow-[var(--shadow-card)]">
          {state === "success" ? (
            <div className="flex flex-col items-center gap-4 py-10 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-signal/15">
                <FiCheck className="h-7 w-7 text-signal" />
              </span>
              <h2 className="font-display text-xl font-semibold text-ink">
                Message sent!
              </h2>
              <p className="text-sm text-ash">
                Thanks, {name.split(" ")[0]}! We'll get back to you within 24
                hours.
              </p>
              <button
                onClick={() => {
                  setName("");
                  setEmail("");
                  setMessage("");
                  setState("idle");
                }}
                className="mt-2 font-mono text-sm text-signal hover:underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <h2 className="font-display text-lg font-semibold text-ink">
                Send a message
              </h2>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="contact-name"
                    className="mb-1.5 block text-sm font-medium text-ink"
                  >
                    Name <span className="text-ember">*</span>
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={inputClass}
                    placeholder="Your name"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="contact-email"
                    className="mb-1.5 block text-sm font-medium text-ink"
                  >
                    Email <span className="text-ember">*</span>
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputClass}
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="contact-subject"
                  className="mb-1.5 block text-sm font-medium text-ink"
                >
                  Subject
                </label>
                <select
                  id="contact-subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className={inputClass}
                >
                  {[
                    "General inquiry",
                    "Feature request",
                    "Bug report",
                    "Partnership",
                    "Press & media",
                  ].map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="contact-message"
                  className="mb-1.5 block text-sm font-medium text-ink"
                >
                  Message <span className="text-ember">*</span>
                </label>
                <textarea
                  id="contact-message"
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full resize-none rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink placeholder:text-ash-soft focus:outline-none focus:ring-2 focus:ring-signal/40"
                  placeholder="Tell us what's on your mind…"
                  required
                />
              </div>

              {state === "error" && (
                <div className="flex items-center gap-2 rounded-xl border border-ember/30 bg-ember/10 px-4 py-3 text-sm text-ink">
                  <FiAlertCircle className="h-4 w-4 shrink-0 text-ember" />
                  Something went wrong. Please try again.
                </div>
              )}

              <button
                type="submit"
                disabled={state === "loading"}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper transition-all hover:bg-ink/85 disabled:opacity-50"
              >
                {state === "loading" ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-paper border-t-transparent" />
                    Sending…
                  </>
                ) : (
                  <>
                    <FiSend className="h-4 w-4" /> Send message
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
