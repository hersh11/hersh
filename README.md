# hersh

Personal site and blog for Harsh — a rebuild of [asrvd.me](https://github.com/asrvd/asrvd.me)'s
design on a current stack, with a real blog engine added.

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind v4 · MDX · Auth.js v5 · Neon

## Run it

```bash
npm run dev
```

```bash
npm run build   # production build, also type-checks
npx eslint src  # lint
```

## Pages

| Route          | What it is                                                      |
| -------------- | --------------------------------------------------------------- |
| `/`            | Hero, three most recent posts, top GitHub repos                  |
| `/about`       | Prose from `content/about.mdx`                                    |
| `/now`         | What you're up to, from `content/now.mdx`                         |
| `/links`       | Every profile link, from `src/lib/links.ts`                       |
| `/blog`        | All posts, live search + tag filter                               |
| `/blog/[slug]` | A post: MDX, syntax highlighting, reading time, heading anchors   |
| `/guestbook`   | GitHub sign-in, leave a message, delete your own                  |
| `/spotify`     | Now playing, top artists, top tracks — via Last.fm                |
| `/dashboard`   | Discord presence, live age counter, GitHub / Last.fm / Wakatime   |

Plus `/feed.xml`, `/sitemap.xml` and `/robots.txt`, all generated from your posts.

## Write a post

Create `content/posts/my-post.mdx`:

```mdx
---
title: "My post"
description: "One sentence for the card and the meta description."
date: 2026-09-01
tags: ["typescript", "notes"]
published: true
---

Your writing goes here. Regular Markdown, plus JSX if you want it.
```

| Field         | Required | What it does                                   |
| ------------- | -------- | ---------------------------------------------- |
| `title`       | yes      | Heading, tab title, OG title                    |
| `date`        | yes      | Sort order and the displayed date               |
| `description` | no       | Card blurb and meta description                 |
| `tags`        | no       | Filter chips on `/blog`                         |
| `published`   | no       | `false` = draft: visible in dev, never in prod  |

Commit and push. That's the whole pipeline.

`content/posts/mdx-kitchen-sink.mdx` is a permanent draft showing every formatting
feature — code blocks with filename headers, tables, callouts, task lists. Copy
syntax out of it.

## Make it yours

**`src/lib/site.ts`** first — name, handle, bio, avatar, account usernames, birth
date, site URL. Every page reads from it.

Then:

- `src/lib/links.ts` — the `/links` page. Rows with an empty `url` are hidden, so
  fill in what you use and delete the rest.
- `content/about.mdx`, `content/now.mdx` — prose for those two pages.
- `src/lib/repos.ts` — `/` shows your most-starred repos by default. Put slugs in
  the `featured` array to pick and order them by hand instead.
- `public/avatar.jpg` — your own avatar; point `site.avatar` at `/avatar.jpg`.

Update `site.url` before deploying — it's `https://example.com` right now, which
would put the wrong domain in your sitemap, RSS feed and OG tags.

## Connecting accounts

Everything degrades gracefully: an unconfigured widget explains what's missing
instead of erroring, so you can wire these up one at a time. Copy `.env.example`
to `.env.local` and fill in as you go.

| What                     | Needs                                                              |
| ------------------------ | ------------------------------------------------------------------ |
| GitHub stats, top repos  | Nothing. Already working.                                           |
| `/spotify`, scrobbles    | `LASTFM_API_KEY` + `site.lastfm`. Connect Spotify to Last.fm so plays scrobble. |
| Discord presence         | `site.discordId`, and join [discord.gg/lanyard](https://discord.gg/lanyard) so their API can see you. No key. |
| Coding hours             | `WAKATIME_API_KEY` + `site.wakatime`.                               |
| Guestbook                | `DATABASE_URL` (Neon), `AUTH_SECRET`, `AUTH_GITHUB_ID/SECRET`, and run `db/schema.sql` once. |

## What changed from asrvd.me

Same design language, different machinery:

- **A real blog.** The original had none — it linked out to dev.to. Posts are MDX
  files here, rendered on the site.
- **Pages Router → App Router**, Next 12 → 16, and no `experimental-edge` runtime.
- **tRPC, Prisma and the NextAuth adapter are gone.** The guestbook is one SQL
  table plus a JWT cookie session; it never needed a full ORM and adapter schema.
- **PlanetScale → Neon**, because PlanetScale discontinued its free tier in 2024.
- **kbar → a local command palette.** kbar's last release is a 2022 beta.
- **Last.fm reads are server-side** with real cache headers, and every widget has
  an explicit "not configured" state rather than rendering blank.

## Notes for future me

- **Code block CSS is deliberately unlayered** (bottom of `src/app/globals.css`).
  `@tailwindcss/typography` registers `prose` in the utilities layer, which beats
  anything in `@layer components` regardless of specificity. Moving those rules
  into a layer will silently break light-mode code blocks.
- **rehype-pretty-code runs two shiki themes at once** and writes the colours as
  `--shiki-light` / `--shiki-dark` custom properties. Both CSS rules are needed.
- **Inline code also gets a figure wrapper** from that plugin, so block styles are
  scoped to `pre >` to keep inline code inline.
- **`pageMetadata` sets `title.absolute`** so the root layout's `harsh // %s`
  template doesn't prefix the handle twice.
- **`getSession()`, not `auth()`.** Auth.js throws `MissingSecret` when the env
  isn't set, which would log a stack trace on every guestbook render.
- **Brand icons come from `react-icons/si`**, except LinkedIn — Simple Icons
  dropped that mark, so it comes from `react-icons/fa6`.

## Deploy

Vercel: import the repo, add the env vars from `.env.example`, done. Add the
custom domain once you buy it, update `site.url`, and add the production callback
URL to your GitHub OAuth app.
