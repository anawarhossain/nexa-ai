"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiMenu, FiX } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";
import { buttonVariants } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { loggedInNav, loggedOutNav, siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

export function Navbar() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const isLoggedIn = !!session;
  const [open, setOpen] = useState(false);

  const navItems = isLoggedIn ? loggedInNav : loggedOutNav;

  async function handleLogout() {
    await authClient.signOut();
    setOpen(false);
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-line bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 font-display text-lg font-semibold tracking-tight"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink text-signal">
            <HiSparkles className="h-3.5 w-3.5" />
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
          {isPending ? (
            <div className="h-9 w-24 animate-pulse rounded-full bg-ink/5" />
          ) : isLoggedIn ? (
            <button
              onClick={handleLogout}
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            >
              Log out
            </button>
          ) : (
            <>
              <Link
                href="/login"
                className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
              >
                Log in
              </Link>
              <Link
                href="/register"
                className={cn(
                  buttonVariants({ variant: "accent", size: "sm" }),
                )}
              >
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
          {open ? <FiX className="h-4 w-4" /> : <FiMenu className="h-4 w-4" />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "overflow-hidden border-b border-line bg-paper transition-[max-height] duration-300 md:hidden",
          open ? "max-h-96" : "max-h-0 border-b-0",
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
              <button
                onClick={handleLogout}
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                )}
              >
                Log out
              </button>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                  )}
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  onClick={() => setOpen(false)}
                  className={cn(
                    buttonVariants({ variant: "accent", size: "sm" }),
                  )}
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
