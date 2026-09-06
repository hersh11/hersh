/**
 * Single source of truth for everything personal on this site.
 * Edit this file first — every page reads from it.
 */

export const site = {
  // ---- identity -----------------------------------------------------------
  name: "Harsh",
  /** Used in the browser tab as `harsh // about`. Keep it lowercase and short. */
  handle: "harsh",
  role: "Student & developer",
  bio: "Learning about the web and building small things end to end. I like open source and I write about what I figure out along the way.",
  /** Update once you buy the domain — this feeds OG tags, RSS and the sitemap. */
  url: "https://example.com",
  locale: "en_IN",
  /** Drop a square image at public/avatar.jpg and change this to "/avatar.jpg". */
  avatar: "https://github.com/hersh11.png",

  // ---- accounts the site reads from ---------------------------------------
  github: "hersh11",
  /** Last.fm username. Powers /spotify and the scrobble count. */
  lastfm: "", // TODO
  /** Discord user ID (18-19 digits, from Developer Mode > Copy User ID). */
  discordId: "", // TODO — also join discord.gg/lanyard so the API can see you
  /** Wakatime username, for the profile link on the coding-hours card. */
  wakatime: "", // TODO

  /**
   * Feeds the live age counter on /dashboard. Nothing but the computed age is
   * ever rendered, but this file is public — remove the card in
   * src/components/stats.tsx if you'd rather not have it in the repo at all.
   */
  birthDate: "2003-08-31T10:00:00+05:30",

  /** Shown in the footer as "MIT <year>-present ©". */
  since: 2026,
} as const;
