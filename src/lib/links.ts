import type { IconType } from "react-icons";
import {
  SiGithub,
  SiDiscord,
  SiInstagram,
  SiX,
  SiSpotify,
  SiLastdotfm,
  SiReddit,
  SiDevdotto,
  SiCodeforces,
  SiLeetcode,
} from "react-icons/si";
// Simple Icons dropped the LinkedIn mark over trademark policy, so it comes
// from Font Awesome instead. Everything else is a Simple Icons brand mark.
import { FaLinkedinIn } from "react-icons/fa6";
import { MdMail } from "react-icons/md";

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
 * Anything with an empty `url` is filtered out, so delete or fill in as you go.
 */
const all: Link[] = [
  { name: "GitHub", url: "https://github.com/hersh11", value: "@hersh11", icon: SiGithub },
  { name: "Email", url: "mailto:hershhnarain@gmail.com", value: "hershhnarain@gmail.com", icon: MdMail },

  // TODO: fill in the ones you use, delete the rest.
  { name: "Discord", url: "", value: "", icon: SiDiscord },
  { name: "X", url: "", value: "", icon: SiX },
  { name: "LinkedIn", url: "", value: "", icon: FaLinkedinIn },
  { name: "Instagram", url: "", value: "", icon: SiInstagram },
  { name: "Spotify", url: "", value: "", icon: SiSpotify },
  { name: "Last.fm", url: "", value: "", icon: SiLastdotfm },
  { name: "Reddit", url: "", value: "", icon: SiReddit },
  { name: "Dev.to", url: "", value: "", icon: SiDevdotto },
  { name: "LeetCode", url: "", value: "", icon: SiLeetcode },
  { name: "Codeforces", url: "", value: "", icon: SiCodeforces },
];

export const links: Link[] = all.filter((l) => l.url !== "");
