"use client";

import { usePathname } from "next/navigation";
import { Link } from "@heroui/link";
import clsx from "clsx";

import { Navbar } from "@/components/navbar";
import { ThemeSwitch } from "@/components/theme-switch";
import { AdminNavbar } from "@/components/admin-navbar";

interface LayoutContentProps {
  children: React.ReactNode;
}

export function LayoutContent({ children }: LayoutContentProps) {
  const pathname = usePathname();
  
  // Check if current page is an auth page
  const isAuthPage = pathname === '/login' || pathname === '/register' || pathname === '/forgot-password' || pathname === '/';
  
  // Check if current page is an admin page
  const isAdminPage = pathname.startsWith('/admin');

  return (
    <div className="relative flex flex-col h-screen">
      {isAuthPage ? (
        // Auth pages: Only show theme toggle
        <div className="absolute top-4 right-4 z-50">
          <ThemeSwitch />
        </div>
      ) : isAdminPage ? (
        // Admin pages: Show admin navbar
        <AdminNavbar />
      ) : (
        // Regular pages: Show regular navbar
        <Navbar />
      )}
      
      <main className={clsx(
        "container mx-auto max-w-7xl px-6 flex-grow",
        isAuthPage ? "pt-0" : "pt-16"
      )}>
        {children}
      </main>
      
      {!isAuthPage && (
        <footer className="w-full flex items-center justify-center py-3">
          <Link
            isExternal
            className="flex items-center gap-1 text-current"
            href="https://neighbourly.com"
            title="neighbourly.com homepage"
          >
            <span className="text-default-600">Built with</span>
            <p className="text-primary">❤️</p>
            <span className="text-default-600">for the community</span>
          </Link>
        </footer>
      )}
    </div>
  );
}