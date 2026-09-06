"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import type { IconType } from "react-icons";
import { FiSearch, FiSun, FiMoon, FiExternalLink } from "react-icons/fi";
import { navItems } from "./nav-items";
import { links } from "@/lib/links";
import { cn } from "@/lib/utils";

type Section = "Navigation" | "Posts" | "External" | "Theme";

type Action = {
  id: string;
  name: string;
  section: Section;
  icon: IconType;
  perform: () => void;
  /** Single-key shortcut, shown on the right and matched while searching. */
  shortcut?: string;
  keywords?: string;
};

type PaletteContext = { open: () => void; close: () => void; isOpen: boolean };

const Ctx = createContext<PaletteContext | null>(null);

export function useCommandPalette() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCommandPalette must be used inside <CommandPaletteProvider>");
  return ctx;
}

/** First letter of each nav item, the way asrvd assigns h/a/n/l/g/s/d. */
const shortcutFor: Record<string, string> = {
  "/": "h",
  "/about": "a",
  "/now": "n",
  "/links": "l",
  "/blog": "b",
  "/guestbook": "g",
  "/spotify": "s",
  "/dashboard": "d",
};

export function CommandPaletteProvider({
  children,
  posts,
}: {
  children: React.ReactNode;
  posts: { slug: string; title: string }[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const router = useRouter();
  const { setTheme, resolvedTheme } = useTheme();
  const listRef = useRef<HTMLDivElement>(null);

  // Resetting here rather than in an effect keeps opening to a single render.
  const open = useCallback(() => {
    setQuery("");
    setCursor(0);
    setIsOpen(true);
  }, []);
  const close = useCallback(() => setIsOpen(false), []);

  const actions = useMemo<Action[]>(() => {
    const go = (href: string) => () => {
      router.push(href);
      setIsOpen(false);
    };

    return [
      ...navItems.map((item) => ({
        id: `nav-${item.href}`,
        name: item.name,
        section: "Navigation" as const,
        icon: item.icon,
        shortcut: shortcutFor[item.href],
        perform: go(item.href),
      })),

      ...posts.map((p) => ({
        id: `post-${p.slug}`,
        name: p.title,
        section: "Posts" as const,
        icon: navItems.find((n) => n.href === "/blog")!.icon,
        perform: go(`/blog/${p.slug}`),
      })),

      ...links.map((link) => ({
        id: `link-${link.name}`,
        name: link.name,
        section: "External" as const,
        icon: link.icon,
        keywords: link.value,
        perform: () => {
          window.open(link.url, link.url.startsWith("mailto:") ? "_self" : "_blank", "noopener,noreferrer");
          setIsOpen(false);
        },
      })),

      {
        id: "theme",
        name: resolvedTheme === "dark" ? "Switch to light mode" : "Switch to dark mode",
        section: "Theme",
        icon: resolvedTheme === "dark" ? FiSun : FiMoon,
        keywords: "theme dark light appearance",
        perform: () => {
          setTheme(resolvedTheme === "dark" ? "light" : "dark");
          setIsOpen(false);
        },
      },
    ];
  }, [posts, router, resolvedTheme, setTheme]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return actions;
    return actions.filter((a) =>
      `${a.name} ${a.keywords ?? ""} ${a.section} ${a.shortcut ?? ""}`.toLowerCase().includes(q),
    );
  }, [actions, query]);

  // Filtering can shrink the list out from under the cursor, so clamp at render
  // time rather than chasing it with an effect.
  const activeIndex = Math.min(cursor, Math.max(results.length - 1, 0));

  // Global Ctrl/Cmd+K.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((wasOpen) => {
          if (!wasOpen) {
            setQuery("");
            setCursor(0);
          }
          return !wasOpen;
        });
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Keep the page behind the overlay from scrolling while it is open.
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  // Keep the highlighted row in view while arrowing through a long list.
  useEffect(() => {
    listRef.current?.querySelector('[data-active="true"]')?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  function onInputKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setCursor((c) => (c + 1) % Math.max(results.length, 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setCursor((c) => (c - 1 + results.length) % Math.max(results.length, 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      results[activeIndex]?.perform();
    } else if (e.key === "Escape") {
      e.preventDefault();
      close();
    }
  }

  let lastSection: Section | null = null;

  return (
    <Ctx.Provider value={{ open, close, isOpen }}>
      {children}

      {isOpen && (
        <div
          className="fixed inset-0 z-100 flex items-start justify-center bg-zinc-800/30 p-4 pt-[14vh] backdrop-blur"
          onClick={close}
          role="presentation"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl overflow-hidden rounded-lg bg-zinc-100 shadow-xl dark:bg-zinc-900"
          >
            <div className="flex items-center gap-3 border-b border-zinc-300 px-3 dark:border-zinc-800">
              <FiSearch size="1rem" className="shrink-0 text-zinc-500" aria-hidden />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onInputKeyDown}
                placeholder="Type a page, post or link..."
                aria-label="Search commands"
                className="w-full bg-transparent py-3 text-sm text-zinc-900 placeholder:text-zinc-500 focus:outline-none dark:text-zinc-200"
              />
            </div>

            <div ref={listRef} className="max-h-80 overflow-y-auto pb-2">
              {results.length === 0 && (
                <p className="px-3 py-6 text-center text-sm text-zinc-500">No results.</p>
              )}

              {results.map((action, i) => {
                const showSection = action.section !== lastSection;
                lastSection = action.section;
                return (
                  <div key={action.id}>
                    {showSection && (
                      <p className="m-0 px-3 pt-3 pb-1 text-xs text-zinc-600 uppercase dark:text-zinc-500">
                        {action.section}
                      </p>
                    )}
                    <button
                      type="button"
                      data-active={i === activeIndex}
                      onMouseMove={() => setCursor(i)}
                      onClick={action.perform}
                      className={cn(
                        "flex w-full items-center justify-between px-3 py-2 text-left transition-all duration-200",
                        i === activeIndex ? "bg-zinc-200 dark:bg-zinc-800" : "bg-transparent",
                      )}
                    >
                      <span className="flex items-center gap-3 text-sm text-zinc-900 dark:text-zinc-200">
                        <action.icon size="1rem" className="shrink-0 text-zinc-500" aria-hidden />
                        <span className="truncate">{action.name}</span>
                        {action.section === "External" && (
                          <FiExternalLink size="0.7rem" className="shrink-0 text-zinc-500" aria-hidden />
                        )}
                      </span>
                      {action.shortcut && (
                        <kbd className="ml-2 h-fit rounded bg-zinc-300 px-2 py-1 text-xs text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300">
                          {action.shortcut}
                        </kbd>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </Ctx.Provider>
  );
}
