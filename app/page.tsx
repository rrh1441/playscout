// app/page.tsx (Complete Fix)
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar, ExternalLink, Search, Users, MapPin } from "lucide-react";
import { Suspense } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { WaitlistForm } from "@/components/WaitlistForm";
import { getWeekendActivities, getFallbackActivities } from "@/lib/dataFetching";

// Static component to display when activities are loading
const ActivitySkeleton = () => (
  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
    {[1, 2, 3].map((i) => (
      <Card key={i} className="flex flex-col overflow-hidden rounded-lg shadow-md h-full animate-pulse">
        <div className="relative h-48 w-full bg-gray-200 dark:bg-gray-700"></div>
        <CardContent className="p-4 flex-grow">
          <div className="h-6 bg-gray-200 rounded dark:bg-gray-700 mb-2"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded dark:bg-gray-700"></div>
            <div className="h-4 bg-gray-200 rounded dark:bg-gray-700"></div>
          </div>
        </CardContent>
        <CardFooter className="border-t bg-gray-50 p-3 dark:bg-gray-800">
          <div className="w-full h-8 bg-gray-200 rounded dark:bg-gray-700"></div>
        </CardFooter>
      </Card>
    ))}
  </div>
);

// Activity display component
function ActivityCards({ activities }: { activities: any[] }) {
  // Default image handling
  const getImageUrl = (activity: any) => {
    if (!activity.imageURL || activity.imageURL === 'null' || activity.imageURL === '') {
      return `/api/placeholder/300/200?text=${encodeURIComponent(activity.name)}`;
    }
    return activity.imageURL;
  };

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {activities.map((activity) => (
        <Card 
          key={activity.id} 
          className="flex flex-col overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 h-full"
        >
          <div className="relative h-48 w-full bg-muted">
            <Image
              src={getImageUrl(activity)}
              alt={activity.name}
              fill
              style={{ objectFit: 'cover' }}
              className="rounded-t-lg"
              unoptimized
            />
          </div>
          <CardContent className="p-4 flex-grow">
            <h3 className="mb-2 text-lg font-semibold leading-tight text-gray-800">{activity.name}</h3>
            <div className="space-y-1.5 text-sm text-gray-600">
              <div className="flex items-center">
                <Users className="mr-1.5 h-4 w-4 text-orange-500 flex-shrink-0" />
                <span>{activity.ageRange || 'All ages'}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="mr-1.5 h-4 w-4 text-orange-500 flex-shrink-0" />
                <span>{activity.location || 'Various locations'}</span>
              </div>
              <div className="flex items-center pt-1">
                <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 border border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700">
                  {activity.category || 'General'}
                </span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t bg-gray-50 p-3 dark:bg-gray-800">
            <Button 
              variant="outline" 
              className="w-full border-orange-500 text-orange-500 hover:bg-orange-50 hover:text-orange-600 dark:border-orange-400 dark:text-orange-400 dark:hover:bg-gray-700 dark:hover:text-orange-300" 
              asChild
            >
              <Link href={`/activities/${activity.id}`}>View Details</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

// Async component to fetch and display activities
async function FeaturedActivities() {
  // Try to get activities from the API, use fallback data if it fails
  let activities;
  try {
    activities = await getWeekendActivities();
    
    // If we couldn't get any activities, use the fallback data
    if (!activities || activities.length === 0) {
      activities = getFallbackActivities();
    }
  } catch (error) {
    console.error("Error fetching featured activities:", error);
    activities = getFallbackActivities();
  }

  return <ActivityCards activities={activities} />;
}

// WaitlistSection component
function WaitlistSection() {
  return (
    <section id="waitlist" className="bg-orange-50 px-4 py-10 md:py-12 dark:bg-orange-900/20">
      <div className="container mx-auto max-w-lg text-center">
        <h2 className="mb-2 text-2xl font-bold md:text-3xl text-gray-900 dark:text-orange-100">Be the First to Know!</h2>
        <p className="mb-6 text-gray-600 dark:text-orange-200">
          PlayScout is launching soon. Enter your email below to get notified when we arrive in your area.
        </p>
        <div className="waitlist-form-container">
          <WaitlistForm />
        </div>
      </div>
    </section>
  );
}

// Hero Section component 
function HeroSection() {
  return (
    <section className="bg-gradient-to-b from-orange-50 to-white px-4 py-10 md:py-14 lg:py-20">
      <div className="container mx-auto">
        <div className="grid items-center gap-8 md:grid-cols-2">
          <div className="text-center md:text-left">
            <h1 className="mb-3 text-3xl font-bold leading-tight tracking-tighter md:text-4xl lg:text-5xl text-gray-900">
              Find the perfect activity for your kid—fast
            </h1>
            <p className="mb-6 text-lg text-gray-600 md:text-xl">
              Discover and explore the best local activities, classes, and camps for children of all ages.
            </p>
            <Button size="lg" className="bg-orange-500 px-8 hover:bg-orange-600" asChild>
              <Link href="/activities">
                Browse Activities
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
          <div className="order-first md:order-last">
            <div className="relative mx-auto max-w-xl overflow-hidden rounded-lg shadow-lg">
              {/* Using Next.js API placeholder for guaranteed working image */}
              <Image
                src="/api/placeholder/600/400"
                alt="Children playing and having fun"
                width={600}
                height={400}
                className="h-auto w-full object-cover"
                priority
                unoptimized
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Main page component
export default function LandingPage() {
  return (
    <main className="flex-1">
      {/* Hero Section */}
      <HeroSection />

      {/* Featured Activities Section */}
      <section id="featured-activities" className="px-4 py-12 md:py-16">
        <div className="container mx-auto">
          <h2 className="mb-8 text-center text-2xl font-bold md:text-3xl text-gray-800">Featured Activities</h2>
          <Suspense fallback={<ActivitySkeleton />}>
            <FeaturedActivities />
          </Suspense>
          <div className="mt-10 text-center">
            <Button className="bg-orange-500 hover:bg-orange-600" size="lg" asChild>
              <Link href="/activities">
                View All Activities
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="bg-gray-50 px-4 py-12 md:py-16 dark:bg-gray-800">
        <div className="container mx-auto max-w-5xl">
          <h2 className="mb-8 text-center text-2xl font-bold md:text-3xl text-gray-800 dark:text-gray-100">How PlayScout Works</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-lg bg-white p-6 text-center shadow-md transition-transform hover:scale-105 dark:bg-gray-900">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-orange-500 dark:bg-orange-900/30 dark:text-orange-400">
                <Search className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-semibold dark:text-white">Search & Discover</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Easily browse activities by age, location, or category using our simple filters.</p>
            </div>
            <div className="rounded-lg bg-white p-6 text-center shadow-md transition-transform hover:scale-105 dark:bg-gray-900">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-500 dark:bg-green-900/30 dark:text-green-400">
                <Calendar className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-semibold dark:text-white">Choose the Best Fit</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">View detailed descriptions and find the perfect match for your child's interests and schedule.</p>
            </div>
            <div className="rounded-lg bg-white p-6 text-center shadow-md transition-transform hover:scale-105 dark:bg-gray-900">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-orange-500 dark:bg-orange-900/30 dark:text-orange-400">
                <ExternalLink className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-semibold dark:text-white">Register Directly</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Click the registration link to sign up quickly and easily with the activity provider.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Waitlist Section */}
      <WaitlistSection />

      {/* Call to Action / Submit */}
      <section id="submit-cta" className="px-4 py-12 md:py-16 text-center bg-white border-t dark:bg-gray-950 dark:border-gray-800">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold md:text-3xl text-gray-800 mb-4 dark:text-gray-100">List Your Activity on PlayScout!</h2>
          <p className="text-lg text-gray-600 mb-6 dark:text-gray-400">
            Are you an activity provider? Reach more parents by listing your classes, camps, or workshops on PlayScout. It's easy!
          </p>
          <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white" asChild>
            <Link href="/submit">Submit Your Activity Now</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}