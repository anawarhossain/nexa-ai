"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiZap,
  FiGrid,
  FiPlusCircle,
  FiSettings,
  FiBarChart2,
  FiCpu,
  FiMessageSquare,
} from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";
import { cn } from "@/lib/utils";

const sidebarModules = [
  {
    label: "Content Generator",
    href: "/dashboard/content-generator",
    icon: FiZap,
    live: true,
  },
  {
    label: "Explore Items",
    href: "/items",
    icon: FiGrid,
    live: true,
  },
  {
    label: "Add Item",
    href: "/items/add",
    icon: FiPlusCircle,
    live: true,
  },
  {
    label: "Analytics",
    href: "/dashboard",
    icon: FiBarChart2,
    live: true,
  },
  {
    label: "AI Agent Builder",
    href: "#",
    icon: FiCpu,
    live: false,
    soon: true,
  },
  {
    label: "Chat Interface",
    href: "#",
    icon: FiMessageSquare,
    live: false,
    soon: true,
  },
  {
    label: "Settings",
    href: "#",
    icon: FiSettings,
    live: false,
    soon: true,
  },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-line bg-white lg:flex">
      {/* Logo area */}
      <div className="flex h-16 items-center gap-2 border-b border-line px-5">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink text-signal">
          <HiSparkles className="h-3.5 w-3.5" />
        </span>
        <span className="font-display text-sm font-semibold text-ink">
          Dashboard
        </span>
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
        <p className="mb-1 px-3 font-mono text-[10px] uppercase tracking-widest text-ash-soft">
          Modules
        </p>

        {sidebarModules.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href !== "#" &&
            (pathname === item.href ||
              (item.href !== "/dashboard" &&
                pathname.startsWith(item.href)));

          return (
            <Link
              key={item.label}
              href={item.href}
              aria-disabled={!item.live}
              onClick={(e) => !item.live && e.preventDefault()}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all",
                isActive
                  ? "bg-ink text-paper"
                  : item.live
                  ? "text-ash hover:bg-ink/5 hover:text-ink"
                  : "cursor-not-allowed text-ash-soft opacity-60"
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4 shrink-0",
                  isActive ? "text-signal" : ""
                )}
              />
              <span className="flex-1 font-medium">{item.label}</span>
              {item.live && (
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider",
                    isActive
                      ? "bg-signal/20 text-signal"
                      : "bg-signal/10 text-signal"
                  )}
                >
                  Live
                </span>
              )}
              {item.soon && (
                <span className="rounded-full bg-ink/8 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-ash-soft">
                  Soon
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-line p-4">
        <p className="font-mono text-[10px] text-ash-soft">
          Nexa AI — Phase 6
        </p>
      </div>
    </aside>
  );
}
