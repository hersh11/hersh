"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { FiSun, FiMoon, FiCommand } from "react-icons/fi";
import { cn } from "@/lib/utils";
import { navItems, isActive } from "./nav-items";
import { useCommandPalette } from "./command-palette";

/** Shared look for every button in the rail, matching asrvd's icon buttons. */
const button =
  "group relative flex w-full items-center justify-center rounded shadow transition " +
  "duration-300 ease-in-out hover:scale-110 hover:shadow-xl " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-500";

const idle = "bg-zinc-700 hover:bg-zinc-800 dark:bg-zinc-800 dark:hover:bg-zinc-700";
const active = "bg-zinc-800 dark:bg-zinc-700";

/** Fixed vertical rail down the left edge. Hidden below `md` — see MobileNav. */
export function Nav() {
  const pathname = usePathname();
  const { setTheme, resolvedTheme } = useTheme();
  const { open } = useCommandPalette();

  return (
    <nav
      aria-label="Main"
      className="fixed left-0 z-50 hidden h-full w-[6%] flex-col items-center pt-6 md:flex"
    >
      <div className="flex flex-col gap-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive(pathname, item.href) ? "page" : undefined}
            className={cn(button, isActive(pathname, item.href) ? active : idle)}
          >
            <span className="p-2">
              <item.icon size="1rem" className="text-zinc-100" aria-hidden />
            </span>
            <span className="sr-only">{item.name}</span>
            <Tooltip>{item.name}</Tooltip>
          </Link>
        ))}

        <button
          type="button"
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          className={cn(button, idle)}
        >
          {/* Both icons render and CSS picks one off the `dark` class next-themes
              sets on <html>. Avoids a mounted flag and the flash it causes. */}
          <span className="p-2 text-zinc-100">
            <FiMoon size="1rem" className="dark:hidden" aria-hidden />
            <FiSun size="1rem" className="hidden dark:block" aria-hidden />
          </span>
          <span className="sr-only">Toggle theme</span>
          <Tooltip>Theme</Tooltip>
        </button>

        <button type="button" onClick={open} className={cn(button, idle)}>
          <span className="p-2">
            <FiCommand size="1rem" className="text-zinc-100" aria-hidden />
          </span>
          <span className="sr-only">Open command palette</span>
          <Tooltip>Command</Tooltip>
        </button>
      </div>

      <div className="mt-4 h-full border-r-2 border-zinc-500 dark:border-zinc-800" />
    </nav>
  );
}

function Tooltip({ children }: { children: React.ReactNode }) {
  return (
    <span
      role="tooltip"
      className="pointer-events-none absolute left-full z-50 ml-2 w-max rounded bg-zinc-800
                 px-2.5 py-2.5 text-xs leading-none whitespace-nowrap text-zinc-200 opacity-0
                 shadow-xl transition-opacity group-hover:opacity-100 dark:bg-zinc-700"
    >
      {children}
    </span>
  );
}
