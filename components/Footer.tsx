// components/Footer.tsx
import React from 'react';

export default function Footer() {
  return (
    <footer className="mt-auto border-t bg-muted/50 px-4 py-6"> {/* Use mt-auto for flex layout */}
      <div className="container mx-auto text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} PlayScout. All rights reserved.
        {/* You can add more footer links here if needed */}
        {/* <div className="flex justify-center space-x-4 mt-2">
          <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
          <Link href="/terms" className="hover:underline">Terms of Service</Link>
        </div> */}
      </div>
    </footer>
  );
}