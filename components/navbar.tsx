"use client";

import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@heroui/navbar";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { Avatar } from "@heroui/avatar";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/dropdown";
import { link as linkStyles } from "@heroui/theme";
import NextLink from "next/link";
import clsx from "clsx";
import { useState } from "react";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";

// Neighbourly Logo Component
const NeighbourlyLogo = () => (
  <svg
    fill="none"
    height="32"
    viewBox="0 0 32 32"
    width="32"
    className="text-primary"
  >
    <path
      d="M16 2L4 8v12c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V8l-12-6z"
      fill="currentColor"
      opacity="0.8"
    />
    <path
      d="M16 6L8 10v8c0 3.33 2.31 6.44 5.4 7.2 3.09-.76 5.4-3.87 5.4-7.2v-8L16 6z"
      fill="currentColor"
    />
    <circle cx="16" cy="14" r="2" fill="white" />
  </svg>
);

export const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Mock auth state
  const [user] = useState({
    name: "John Doe",
    email: "john@example.com",
    avatar: "https://i.pravatar.cc/150?img=5",
    role: "both" as "provider" | "seeker" | "both"
  });

  return (
    <HeroUINavbar maxWidth="xl" position="sticky" className="border-b border-divider">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-2" href="/">
            <NeighbourlyLogo />
            <div className="flex flex-col">
              <p className="font-bold text-lg text-primary">Neighbourly</p>
              <p className="text-xs text-default-500">Community Marketplace</p>
            </div>
          </NextLink>
        </NavbarBrand>
        <ul className="hidden lg:flex gap-6 justify-start ml-8">
          {siteConfig.navItems.map((item) => (
            <NavbarItem key={item.href}>
              <NextLink
                className={clsx(
                  linkStyles({ color: "foreground" }),
                  "data-[active=true]:text-primary data-[active=true]:font-medium hover:text-primary transition-colors",
                )}
                href={item.href}
              >
                {item.label}
              </NextLink>
            </NavbarItem>
          ))}
        </ul>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex basis-1/5 sm:basis-full" justify="end">
        <NavbarItem>
          <ThemeSwitch />
        </NavbarItem>
        
        {!isLoggedIn ? (
          <>
            <NavbarItem className="hidden md:flex">
              <Button
                as={NextLink}
                href="/login"
                variant="flat"
                color="primary"
              >
                Login
              </Button>
            </NavbarItem>
            <NavbarItem>
              <Button
                as={NextLink}
                href="/register"
                color="primary"
              >
                Join Community
              </Button>
            </NavbarItem>
          </>
        ) : (
          <NavbarItem>
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Avatar
                  as="button"
                  className="transition-transform hover:scale-105"
                  color="primary"
                  name={user.name}
                  size="sm"
                  src={user.avatar}
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownItem key="profile" className="h-14 gap-2">
                  <p className="font-semibold">Signed in as</p>
                  <p className="font-semibold">{user.email}</p>
                </DropdownItem>
                <DropdownItem key="dashboard" as={NextLink} href="/dashboard">
                  Dashboard
                </DropdownItem>
                <DropdownItem key="my-services" as={NextLink} href="/my-services">
                  My Services
                </DropdownItem>
                <DropdownItem key="bookings" as={NextLink} href="/bookings">
                  My Bookings
                </DropdownItem>
                <DropdownItem key="messages" as={NextLink} href="/messages">
                  Messages
                </DropdownItem>
                <DropdownItem key="settings" as={NextLink} href="/settings">
                  Settings
                </DropdownItem>
                <DropdownItem key="help" as={NextLink} href="/help">
                  Help & Support
                </DropdownItem>
                <DropdownItem 
                  key="logout" 
                  color="danger"
                  onClick={() => setIsLoggedIn(false)}
                >
                  Log Out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </NavbarItem>
        )}
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <ThemeSwitch />
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu>
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {siteConfig.navItems.map((item) => (
            <NavbarMenuItem key={item.href}>
              <NextLink
                className="w-full text-lg"
                href={item.href}
              >
                {item.label}
              </NextLink>
            </NavbarMenuItem>
          ))}
          <div className="mt-4 pt-4 border-t border-divider">
            {!isLoggedIn ? (
              <>
                <NavbarMenuItem>
                  <Button
                    as={NextLink}
                    href="/login"
                    variant="flat"
                    color="primary"
                    className="w-full mb-2"
                  >
                    Login
                  </Button>
                </NavbarMenuItem>
                <NavbarMenuItem>
                  <Button
                    as={NextLink}
                    href="/register"
                    color="primary"
                    className="w-full"
                  >
                    Join Community
                  </Button>
                </NavbarMenuItem>
              </>
            ) : (
              <>
                {siteConfig.navMenuItems.map((item, index) => (
                  <NavbarMenuItem key={`${item.label}-${index}`}>
                    <Link
                      className="w-full"
                      color={index === siteConfig.navMenuItems.length - 1 ? "danger" : "foreground"}
                      href={item.href}
                      size="lg"
                    >
                      {item.label}
                    </Link>
                  </NavbarMenuItem>
                ))}
              </>
            )}
          </div>
        </div>
      </NavbarMenu>
    </HeroUINavbar>
  );
};
