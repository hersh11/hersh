"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { FiSun, FiMoon, FiCommand } from "react-icons/fi";
import { cn } from "@/lib/utils";
import { navItems, isActive } from "./nav-items";
import { useCommandPalette } from "./command-palette";

const button =
  "flex shrink-0 items-center justify-center rounded p-2 text-zinc-100 shadow transition " +
  "duration-300 ease-in-out hover:scale-110 hover:shadow-xl";

const idle = "bg-zinc-700 hover:bg-zinc-800 dark:bg-zinc-800 dark:hover:bg-zinc-700";
const active = "bg-zinc-800 dark:bg-zinc-700";

/**
 * Floating pill across the top on small screens, mirroring asrvd.me.
 * The nav list scrolls horizontally; theme and command stay pinned on the right.
 */
export function MobileNav() {
  const pathname = usePathname();
  const { setTheme, resolvedTheme } = useTheme();
  const { open } = useCommandPalette();

  return (
    <div className="fixed top-0 z-50 w-full px-4 pt-4 md:hidden">
      <nav
        aria-label="Main"
        className="flex items-center gap-3 rounded-lg bg-zinc-500/60 py-2 pr-2 pl-3 shadow-xl
                   backdrop-blur dark:bg-zinc-800/70"
      >
        <div className="flex flex-1 gap-3 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(pathname, item.href) ? "page" : undefined}
              className={cn(button, isActive(pathname, item.href) ? active : idle)}
            >
              <item.icon size="1rem" aria-hidden />
              <span className="sr-only">{item.name}</span>
            </Link>
          ))}
        </div>

        <div className="flex shrink-0 gap-2 border-l border-zinc-400/40 pl-2 dark:border-zinc-600/60">
          <button
            type="button"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className={cn(button, idle)}
          >
            <FiMoon size="1rem" className="dark:hidden" aria-hidden />
            <FiSun size="1rem" className="hidden dark:block" aria-hidden />
            <span className="sr-only">Toggle theme</span>
          </button>

          <button type="button" onClick={open} className={cn(button, idle)}>
            <FiCommand size="1rem" aria-hidden />
            <span className="sr-only">Open command palette</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
