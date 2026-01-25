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
import { useRouter } from "next/navigation";

import { ThemeSwitch } from "@/components/theme-switch";
import { useAuth } from "@/contexts/AuthContext";

// Neighbourly Logo Component
const NeighbourlyLogo = () => (
  <svg
    fill="none"
    height="32"
    viewBox="0 0 32 32"
    width="32"
    className="text-primary group-hover:scale-110 transition-transform duration-300"
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
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const getRoleBasedNavItems = () => {
    if (!user) return [];
    const baseItems = [{ label: "Dashboard", href: "/dashboard" }];

    if (user.role === 'seeker') {
      return [...baseItems, { label: "Services", href: "/services" }, { label: "Bookings", href: "/my-bookings" }];
    }
    if (user.role === 'provider') {
      return [...baseItems, { label: "Catalog", href: "/my-services" }, { label: "Schedule", href: "/manage-bookings" }];
    }
    if (user.role === 'both') {
      return [
        ...baseItems,
        { label: "Find", href: "/services" },
        { label: "Catalog", href: "/my-services" },
        { label: "Requests", href: "/manage-bookings" },
      ];
    }
    return baseItems;
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navItems = getRoleBasedNavItems();

  return (
    <HeroUINavbar
      maxWidth="xl"
      position="sticky"
      className="bg-background/70 backdrop-blur-xl border-b border-divider/50 shadow-sm"
      classNames={{
        item: [
          "flex",
          "relative",
          "h-full",
          "items-center",
          "data-[active=true]:after:content-['']",
          "data-[active=true]:after:absolute",
          "data-[active=true]:after:bottom-0",
          "data-[active=true]:after:left-0",
          "data-[active=true]:after:right-0",
          "data-[active=true]:after:h-[2px]",
          "data-[active=true]:after:rounded-[2px]",
          "data-[active=true]:after:bg-primary",
        ],
      }}
    >
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit group">
          <NextLink className="flex justify-start items-center gap-3" href={isAuthenticated ? "/dashboard" : "/"}>
            <NeighbourlyLogo />
            <div className="flex flex-col gap-0 leading-tight">
              <p className="font-black text-xl tracking-tighter text-primary">Neighbourly</p>
              <p className="text-[9px] font-black text-default-400 uppercase tracking-widest opacity-70">Community First</p>
            </div>
          </NextLink>
        </NavbarBrand>

        {isAuthenticated && (
          <ul className="hidden lg:flex gap-8 justify-start ml-12">
            {navItems.map((item) => (
              <NavbarItem key={item.href}>
                <NextLink
                  className={clsx(
                    "text-sm font-black uppercase tracking-widest text-default-500 hover:text-primary transition-all duration-300",
                    "data-[active=true]:text-primary"
                  )}
                  href={item.href}
                >
                  {item.label}
                </NextLink>
              </NavbarItem>
            ))}
          </ul>
        )}
      </NavbarContent>

      <NavbarContent className="hidden sm:flex basis-1/5 sm:basis-full" justify="end" gap-6>
        <NavbarItem className="hidden md:flex">
          <ThemeSwitch />
        </NavbarItem>

        {!isAuthenticated ? (
          <>
            <NavbarItem className="hidden md:flex">
              <Button
                as={NextLink}
                href="/login"
                variant="light"
                className="font-black text-xs uppercase tracking-widest"
              >
                Login
              </Button>
            </NavbarItem>
            <NavbarItem>
              <Button
                as={NextLink}
                href="/register"
                color="primary"
                radius="lg"
                className="font-black text-xs uppercase tracking-widest px-8 shadow-lg shadow-primary/20"
              >
                Join
              </Button>
            </NavbarItem>
          </>
        ) : (
          <NavbarItem>
            <Dropdown placement="bottom-end" classNames={{ content: "bg-background/80 backdrop-blur-xl border border-divider/50 shadow-2xl" }}>
              <DropdownTrigger>
                <Avatar
                  as="button"
                  className="w-10 h-10 border-2 border-primary/20 hover:border-primary transition-all p-1 bg-transparent"
                  radius="lg"
                  src={user?.avatar || undefined}
                  name={user?.name}
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownItem key="profile" className="h-14 gap-2 opacity-100 pointer-events-none">
                  <p className="font-black text-[10px] uppercase text-default-400">Signed in as</p>
                  <p className="font-black text-sm tracking-tight">{user?.email}</p>
                </DropdownItem>
                <DropdownItem
                  key="account"
                  as={NextLink}
                  href="/account"
                  className="font-bold py-3"
                  startContent={<div className="w-1.5 h-1.5 rounded-full bg-primary" />}
                >
                  Account Settings
                </DropdownItem>
                <DropdownItem
                  key="logout"
                  color="danger"
                  className="text-danger font-black uppercase text-xs tracking-widest py-3 mt-2 border-t border-divider/50 rounded-none"
                  onPress={handleLogout}
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
        <NavbarMenuToggle className="text-default-500" />
      </NavbarContent>

      <NavbarMenu className="bg-background/90 backdrop-blur-2xl pt-10 px-8">
        <div className="flex flex-col gap-8">
          {isAuthenticated ? (
            <>
              <div className="flex items-center gap-4 mb-4">
                <Avatar size="lg" radius="lg" src={user?.avatar || undefined} name={user?.name} />
                <div>
                  <p className="font-black text-lg tracking-tight">{user?.name}</p>
                  <p className="text-xs font-bold text-default-400">{user?.email}</p>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase text-primary tracking-[0.2em] mb-6">Navigation</p>
                {navItems.map((item) => (
                  <NavbarMenuItem key={item.href}>
                    <NextLink
                      className="text-2xl font-black tracking-tighter hover:text-primary transition-colors block"
                      href={item.href}
                    >
                      {item.label}
                    </NextLink>
                  </NavbarMenuItem>
                ))}
              </div>

              <div className="mt-10 pt-10 border-t border-divider/50 space-y-6">
                <NextLink href="/account" className="text-lg font-black tracking-tight flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  Manage Account
                </NextLink>
                <Button
                  className="w-full h-14 font-black uppercase tracking-widest text-xs"
                  color="danger"
                  variant="flat"
                  onPress={handleLogout}
                >
                  Logout
                </Button>
              </div>
            </>
          ) : (
            <div className="space-y-4 pt-10">
              <Button as={NextLink} href="/login" variant="flat" color="primary" className="w-full h-14 font-black text-sm uppercase">Login</Button>
              <Button as={NextLink} href="/register" color="primary" className="w-full h-14 font-black text-sm uppercase shadow-xl">Join Now</Button>
            </div>
          )}
        </div>
      </NavbarMenu>
    </HeroUINavbar>
  );
};
