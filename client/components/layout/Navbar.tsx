"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Sparkles } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { loggedInNav, loggedOutNav, siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

/**
 * isLoggedIn এখন hardcoded false — Phase 3 এ Better Auth এর session hook
 * (useSession) দিয়ে রিপ্লেস হবে। বাকি সব লজিক (নেভ আইটেম সুইচ, CTA বাটন)
 * তখন কোনো পরিবর্তন ছাড়াই কাজ করবে।
 */
export function Navbar() {
  const isLoggedIn = false;
  const [open, setOpen] = useState(false);

  const navItems = isLoggedIn ? loggedInNav : loggedOutNav;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-line bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link href="/" className="flex items-center gap-2 font-display text-lg font-semibold tracking-tight">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink text-signal">
            <Sparkles className="h-3.5 w-3.5" />
          </span>
          {siteConfig.name}
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-mono text-[13px] uppercase tracking-wide text-ash transition-colors hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {isLoggedIn ? (
            <Link href="/api/auth/sign-out" className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
              Log out
            </Link>
          ) : (
            <>
              <Link href="/login" className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}>
                Log in
              </Link>
              <Link href="/register" className={cn(buttonVariants({ variant: "accent", size: "sm" }))}>
                Get started
              </Link>
            </>
          )}
        </div>

        <button
          aria-label={open ? "Close menu" : "Open menu"}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-line md:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "overflow-hidden border-b border-line bg-paper transition-[max-height] duration-300 md:hidden",
          open ? "max-h-96" : "max-h-0 border-b-0"
        )}
      >
        <nav className="flex flex-col gap-1 px-5 py-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2.5 font-mono text-sm uppercase tracking-wide text-ash hover:bg-ink/5 hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
          <div className="mt-2 flex flex-col gap-2 border-t border-line pt-4">
            {isLoggedIn ? (
              <Button variant="outline" size="sm">
                Log out
              </Button>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  onClick={() => setOpen(false)}
                  className={cn(buttonVariants({ variant: "accent", size: "sm" }))}
                >
                  Get started
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
