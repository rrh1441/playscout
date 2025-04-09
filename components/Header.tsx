// components/Header.tsx
// 'use client'; // Add this if you implement active link styling with usePathname later

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
// Import Sheet components if implementing mobile menu later
// import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
// import { MenuIcon } from 'lucide-react'; // Example icon

export default function Header() {
  // const pathname = usePathname(); // Example for active link styling

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 px-4 py-4 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center">
          {/* Placeholder for logo image if you have one */}
          {/* <Image src="/placeholder-logo.svg" alt="PlayScout Logo" width={32} height={32} className="mr-2" /> */}
          <span className="text-xl font-bold text-orange-500">PlayScout</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden space-x-6 md:flex">
          <Link
            href="/activities"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground" // Adjusted style, consider active state later
            // className={cn(
            //   "text-sm font-medium transition-colors hover:text-primary",
            //   pathname === "/activities" ? "text-primary" : "text-muted-foreground"
            // )}
          >
            Activities
          </Link>
          <Link
            href="/submit"
             className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            // className={cn(
            //   "text-sm font-medium transition-colors hover:text-primary",
            //   pathname === "/submit" ? "text-primary" : "text-muted-foreground"
            // )}
          >
            Submit Activity
          </Link>
          <Link
            href="/contact"
             className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            // className={cn(
            //   "text-sm font-medium transition-colors hover:text-primary",
            //   pathname === "/contact" ? "text-primary" : "text-muted-foreground"
            // )}
          >
            Contact
          </Link>
        </nav>

        {/* Mobile Menu Button (Placeholder for functionality) */}
         {/* Example using Sheet:
         <Sheet>
           <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <MenuIcon className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
           </SheetTrigger>
           <SheetContent side="left">
             {/* Mobile Nav Links Here *}
           </SheetContent>
         </Sheet>
        */}
       <Button variant="ghost" size="icon" className="md:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
            <span className="sr-only">Toggle Menu</span>
        </Button>
      </div>
    </header>
  );
}