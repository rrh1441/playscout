// app/activities/page.tsx
import { Suspense } from 'react';
import Link from 'next/link'; // Import Link
import { getActivities } from '@/lib/googleSheets';
import { ActivityList } from '@/components/ActivityList'; // Client component for filtering/display
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from '@/components/ui/button'; // For mobile menu trigger if needed

// --- Loading Skeleton Component ---
function ActivityGridSkeleton() {
    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Create 6 skeleton cards */}
            {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-lg border bg-card text-card-foreground shadow-sm flex flex-col">
                    {/* Image Skeleton */}
                    <Skeleton className="h-48 w-full rounded-t-lg" />
                    {/* Content Skeleton */}
                    <div className="p-4 space-y-2 flex-grow">
                        <Skeleton className="h-6 w-3/4" /> {/* Title */}
                        <Skeleton className="h-4 w-1/2" /> {/* Info line 1 */}
                        <Skeleton className="h-4 w-1/3" /> {/* Info line 2 */}
                        <Skeleton className="h-5 w-1/4 rounded-full" /> {/* Badge */}
                    </div>
                    {/* Footer Skeleton */}
                    <div className="border-t bg-gray-50 p-3 mt-auto">
                        <Skeleton className="h-9 w-full" /> {/* Button */}
                    </div>
                </div>
            ))}
        </div>
    );
}

// --- Main Page Component ---
export default async function ActivitiesPage() {
    // Fetch initial data on the server (can throw error if sheets fail)
    // Consider adding try/catch here if you want to show a specific error message on this page
    const initialActivities = await getActivities();

    // Derive unique filter options from the fetched data
    // Use Set to get unique values, filter out any empty/null values, then sort
    const uniqueAgeRanges = Array.from(new Set(initialActivities.map(a => a.ageRange).filter(Boolean))).sort();
    const uniqueLocations = Array.from(new Set(initialActivities.map(a => a.location).filter(Boolean))).sort();
    const uniqueCategories = Array.from(new Set(initialActivities.map(a => a.category).filter(Boolean))).sort();

    return (
        <div className="flex min-h-screen flex-col">
            {/* Re-use header from Landing Page or create a shared Header component */}
            <header className="sticky top-0 z-10 border-b bg-white px-4 py-4 shadow-sm">
                <div className="container mx-auto flex items-center justify-between">
                    <Link href="/" className="flex items-center">
                        <span className="text-xl font-bold text-orange-500">PlayScout</span>
                    </Link>
                    {/* Desktop Navigation */}
                    <nav className="hidden space-x-6 md:flex">
                        <Link href="/activities" className="text-sm font-medium text-orange-500">Activities</Link>
                        <Link href="/submit" className="text-sm font-medium hover:text-orange-500">Submit Activity</Link>
                        <Link href="/contact" className="text-sm font-medium hover:text-orange-500">Contact</Link>
                    </nav>
                    {/* Mobile Menu Button (Consider implementing with Sheet component) */}
                    <Button variant="ghost" size="icon" className="md:hidden">
                         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
                         <span className="sr-only">Toggle Menu</span>
                    </Button>
                </div>
            </header>

            <main className="flex-1 px-4 py-10 md:py-12">
                <div className="container mx-auto">
                    <h1 className="mb-8 text-center text-3xl font-bold tracking-tight text-gray-800 md:text-4xl">
                        Explore Activities
                    </h1>

                    {/*
                       Use Suspense for the client component.
                       While the component fetches/filters data client-side,
                       the initial render might still benefit from Suspense,
                       especially if the component itself becomes complex.
                       The fallback shows the skeleton while the JS loads.
                    */}
                    <Suspense fallback={<ActivityGridSkeleton />}>
                        <ActivityList
                            initialActivities={initialActivities}
                            ageRanges={uniqueAgeRanges}
                            locations={uniqueLocations}
                            categories={uniqueCategories}
                        />
                    </Suspense>
                </div>
            </main>

            {/* Re-use footer or create a shared Footer component */}
            <footer className="bg-gray-50 px-4 py-8 mt-auto border-t">
                <div className="container mx-auto text-center text-sm text-gray-600">
                    © {new Date().getFullYear()} PlayScout. All rights reserved.
                </div>
            </footer>
        </div>
    );
}