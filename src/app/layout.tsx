import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/components/theme-provider";
import { CommandPaletteProvider } from "@/components/command-palette";
import { Nav } from "@/components/nav";
import { MobileNav } from "@/components/mobile-nav";
import { getAllPosts } from "@/lib/posts";
import { site } from "@/lib/site";
import { emojiIcon } from "@/lib/metadata";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.handle, template: `${site.handle} // %s` },
  description: site.bio,
  icons: { icon: emojiIcon("🎐") },
  openGraph: {
    title: site.name,
    description: site.bio,
    url: site.url,
    siteName: site.name,
    locale: site.locale,
    type: "website",
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export const viewport = { themeColor: "#27272a" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Post titles are read at build time so the palette can search them.
  const posts = getAllPosts().map(({ slug, title }) => ({ slug, title }));

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <CommandPaletteProvider posts={posts}>
            <main className="relative flex min-h-screen flex-col items-center overflow-x-hidden bg-zinc-100 selection:bg-zinc-200/30 dark:bg-zinc-900">
              <Nav />
              <MobileNav />
              {/* Same proportions as asrvd.me: a narrow centred column. */}
              <div className="flex h-full w-full md:w-2/3 lg:w-[60%]">{children}</div>
            </main>

            <Toaster
              toastOptions={{ style: { background: "#27272a", color: "#e4e4e7" } }}
            />
          </CommandPaletteProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
