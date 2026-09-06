import {
  FiHome,
  FiUser,
  FiClock,
  FiPaperclip,
  FiEdit3,
  FiBookOpen,
  FiHeadphones,
  FiZap,
} from "react-icons/fi";
import type { IconType } from "react-icons";

export type NavItem = { name: string; href: string; icon: IconType };

/** Order mirrors asrvd.me, with /blog slotted in before the guestbook. */
export const navItems: NavItem[] = [
  { name: "Home", href: "/", icon: FiHome },
  { name: "About", href: "/about", icon: FiUser },
  { name: "Now", href: "/now", icon: FiClock },
  { name: "Links", href: "/links", icon: FiPaperclip },
  { name: "Blog", href: "/blog", icon: FiEdit3 },
  { name: "Guestbook", href: "/guestbook", icon: FiBookOpen },
  { name: "Spotify", href: "/spotify", icon: FiHeadphones },
  { name: "Dashboard", href: "/dashboard", icon: FiZap },
];

export function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}
