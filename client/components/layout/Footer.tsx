import Link from "next/link";
import { HiSparkles } from "react-icons/hi2";
import {
  FiGithub,
  FiTwitter,
  FiLinkedin,
  FiMail,
  FiMapPin,
} from "react-icons/fi";
import { footerLinks, siteConfig } from "@/lib/site-config";

export function Footer() {
  return (
    <footer className="border-t border-line bg-ink text-paper">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link
              href="/"
              className="flex items-center gap-2 font-display text-lg font-semibold"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-signal text-ink">
                <HiSparkles className="h-3.5 w-3.5" />
              </span>
              {siteConfig.name}
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-paper/60">
              {siteConfig.description}
            </p>

            <div className="mt-6 space-y-2 text-sm text-paper/60">
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="flex items-center gap-2 hover:text-paper"
              >
                <FiMail className="h-3.5 w-3.5" />
                {siteConfig.contact.email}
              </a>
              <p className="flex items-start gap-2">
                <FiMapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                {siteConfig.contact.address}
              </p>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <a
                href={siteConfig.social.github}
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-line-dark text-paper/70 hover:border-signal hover:text-signal"
              >
                <FiGithub className="h-4 w-4" />
              </a>
              <a
                href={siteConfig.social.twitter}
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter / X"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-line-dark text-paper/70 hover:border-signal hover:text-signal"
              >
                <FiTwitter className="h-4 w-4" />
              </a>
              <a
                href={siteConfig.social.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-line-dark text-paper/70 hover:border-signal hover:text-signal"
              >
                <FiLinkedin className="h-4 w-4" />
              </a>
            </div>
          </div>

          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <h4 className="font-mono text-xs uppercase tracking-wider text-paper/40">
                {group}
              </h4>
              <ul className="mt-4 space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-paper/70 transition-colors hover:text-signal"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-line-dark pt-8 text-xs text-paper/40 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <p className="font-mono">Built as a modular agentic AI platform.</p>
        </div>
      </div>
    </footer>
  );
}
