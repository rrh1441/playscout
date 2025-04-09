// components/Header.tsx
// 'use client'; // Keep commented out unless using hooks like usePathname

import React from 'react';
import Link from 'next/link';
import Image from 'next/image'; // Import if using a logo image
import { Button } from '@/components/ui/button';
// Import Sheet components and icons if implementing mobile menu functionality later
// import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
// import { MenuIcon } from 'lucide-react';

export default function Header() {
  // const pathname = usePathname(); // Example for active link styling

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 px-4 py-4 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:border-gray-800 dark:bg-gray-950/95">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2" aria-label="PlayScout Home">
          {/* Optional: Placeholder logo */}
          {/* <Image src="/placeholder-logo.svg" alt="PlayScout Logo" width={32} height={32} /> */}
          <span className="text-xl font-bold text-orange-500">PlayScout</span>
        </Link>

        {/* Desktop Navigation - Links Removed */}
        <nav className="hidden space-x-6 md:flex">
          {/* Links are removed as requested for the single-page MVP */}
          {/*
          <Link
            href="/activities"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            // Add active styling logic here if needed in the future
          >
            Activities
          </Link>
          <Link
            href="/submit"
             className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Submit Activity
          </Link>
          <Link
            href="/contact"
             className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Contact
          </Link>
           */}
        </nav>

        {/* Mobile Menu Button (Placeholder) */}
        {/* Consider removing this entirely if no mobile navigation is needed for the MVP */}
        <Button variant="ghost" size="icon" className="md:hidden">
          {/* Simple Menu Icon SVG */}
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
            <line x1="4" x2="20" y1="12" y2="12"/>
            <line x1="4" x2="20" y1="6" y2="6"/>
            <line x1="4" x2="20" y1="18" y2="18"/>
          </svg>
          <span className="sr-only">Toggle Menu</span>
          {/* Example using Sheet for a functional mobile menu (keep commented for MVP):
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <MenuIcon className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              {/* Mobile Nav Links Would Go Here *}
              <nav className="flex flex-col space-y-4 p-4">
                 <Link href="/#featured-activities" className="...">Activities</Link>
                 <Link href="/submit" className="...">Submit</Link>
                 <Link href="/contact" className="...">Contact</Link>
              </nav>
            </SheetContent>
          </Sheet>
          */}
        </Button>
      </div>
    </header>
  );
}