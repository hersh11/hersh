/**
 * Single source of truth for everything personal on this site.
 * Edit this file first — every page reads from it.
 */

export const site = {
  // ---- identity -----------------------------------------------------------
  name: "Harsh",
  /** Used in the browser tab as `harsh // about`. Keep it lowercase and short. */
  handle: "harsh",
  role: "Web dev and AI/ML",
  bio: "I'm a CS senior in Noida. I build small web apps, usually because something annoyed me, and I'm learning Japanese on a course I made for myself.",
  /**
   * Feeds OG tags, RSS and the sitemap. Vercel sets VERCEL_PROJECT_PRODUCTION_URL
   * to the project's production domain - the .vercel.app one today, your own
   * domain once it's added in Vercel - so this needs no edit when you buy one.
   * Redeploy after adding a domain so the build picks it up.
   */
  url: process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000",
  locale: "en_IN",
  /** Drop a square image at public/avatar.jpg and change this to "/avatar.jpg". */
  avatar: "https://github.com/hersh11.png",
  /** The Resume button on the home page and the Resume row on /links. "" hides both. */
  resume: "/Harsh_Narain_Resume.pdf",

  // ---- accounts the site reads from ---------------------------------------
  github: "hersh11",
  /**
   * Numeric GitHub account id (api.github.com/users/<github> → `id`). Signing
   * into the guestbook with this account lets you delete anyone's message.
   * The id, unlike the username, can't be renamed and reused by someone else.
   */
  githubId: "72140506",
  /** Medium username, without the @. Its stories are listed on / and /blog. */
  medium: "hershh",
  /** Last.fm username. Powers /spotify and the scrobble count. */
  lastfm: "okharsh",
  /** Discord user ID (18-19 digits). Needs membership of discord.gg/lanyard. */
  discordId: "689165036836356157",
  /** Wakatime username. Leave "" and the Coding Hours card is hidden. */
  wakatime: "",

  /**
   * Feeds the live age counter on /dashboard. Nothing but the computed age is
   * ever rendered, but this file is public — remove the card in
   * src/components/stats.tsx if you'd rather not have it in the repo at all.
   */
  birthDate: "2004-08-31T10:00:00+05:30",

  /** Shown in the footer as "MIT <year>-present ©". */
  since: 2026,
} as const;
