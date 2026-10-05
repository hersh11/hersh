import type { IconType } from "react-icons";
import { SiGithub, SiDiscord, SiInstagram, SiX, SiLastdotfm, SiMedium } from "react-icons/si";
// Simple Icons dropped the LinkedIn mark over trademark policy, so it comes
// from Font Awesome instead. Everything else is a Simple Icons brand mark.
import { FaLinkedinIn } from "react-icons/fa6";
import { MdMail } from "react-icons/md";
import { FiFileText } from "react-icons/fi";
import { site } from "./site";

export type Link = {
  name: string;
  /** Where it goes. Leave "" and the row is hidden. */
  url: string;
  /** The handle shown after the `//` separator. */
  value: string;
  icon: IconType;
};

/**
 * The /links page and the command palette both read this.
 * Anything with an empty `url` is filtered out.
 */
const all: Link[] = [
  { name: "Resume", url: site.resume, value: "PDF on Google Drive", icon: FiFileText },
  { name: "GitHub", url: `https://github.com/${site.github}`, value: `@${site.github}`, icon: SiGithub },
  { name: "LinkedIn", url: "https://www.linkedin.com/in/hershhh", value: "hershhh", icon: FaLinkedinIn },
  {
    name: "Medium",
    url: site.medium ? `https://medium.com/@${site.medium}` : "",
    value: `@${site.medium}`,
    icon: SiMedium,
  },
  { name: "X", url: "https://x.com/hersheheh", value: "@hersheheh", icon: SiX },
  { name: "Instagram", url: "https://www.instagram.com/hershsus/", value: "@hershsus", icon: SiInstagram },
  {
    name: "Discord",
    url: site.discordId ? `https://discord.com/users/${site.discordId}` : "",
    value: "@hersh.",
    icon: SiDiscord,
  },
  {
    name: "Last.fm",
    url: site.lastfm ? `https://www.last.fm/user/${site.lastfm}` : "",
    value: site.lastfm,
    icon: SiLastdotfm,
  },
  { name: "Email", url: "mailto:hershhnarain@gmail.com", value: "hershhnarain@gmail.com", icon: MdMail },
];

export const links: Link[] = all.filter((l) => l.url !== "");
