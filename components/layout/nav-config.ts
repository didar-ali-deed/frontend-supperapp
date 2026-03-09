import {
  Home,
  MessageCircle,
  Wallet,
  BarChart3,
  User,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: string;
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/feed",      label: "Home",      icon: Home },
  { href: "/messages",  label: "Messages",  icon: MessageCircle },
  { href: "/wallet",    label: "Wallet",    icon: Wallet },
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/profile",   label: "Profile",   icon: User },
];
