export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Neighbourly",
  description: "Connect with your community. Share skills, tools, and services locally.",
  navItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Services",
      href: "/services",
    },
    {
      label: "My Bookings",
      href: "/bookings",
    },
    {
      label: "Post Service",
      href: "/post-service",
    },
  ],
  navMenuItems: [
    {
      label: "Profile",
      href: "/profile",
    },
    {
      label: "My Services",
      href: "/my-services",
    },
    {
      label: "My Bookings",
      href: "/bookings",
    },
    {
      label: "Messages",
      href: "/messages",
    },
    {
      label: "Settings",
      href: "/settings",
    },
    {
      label: "Help & Support",
      href: "/help",
    },
    {
      label: "Logout",
      href: "/logout",
    },
  ],
  links: {
    github: "https://github.com/neighbourly-app",
    twitter: "https://twitter.com/neighbourly_app",
    docs: "/docs",
    discord: "https://discord.gg/neighbourly",
    sponsor: "https://patreon.com/neighbourly",
  },
};
