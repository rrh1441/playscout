// app/page.tsx (Re-add Age Range display)
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar, ExternalLink, Search, Users, MapPin, MessageSquare, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { WaitlistForm } from "@/components/WaitlistForm";
import { getActivities } from "@/lib/googleSheets";
import type { Activity } from "@/lib/types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { format, parse, isSaturday, isSunday, addDays, startOfDay, nextSaturday, nextSunday } from 'date-fns';

// Helper function (assuming MM/DD/YYYY format in sheet - ADJUST IF NEEDED)
function parseActivityDate(dateString: string | null): Date | null {
  if (!dateString) return null;
  try {
    const parsed = parse(dateString, 'MM/dd/yyyy', new Date());
    if (isNaN(parsed.getTime())) { console.warn(`Invalid date format: "${dateString}". Expected MM/DD/YYYY.`); return null; }
    return parsed;
  } catch (e) { console.error(`Error parsing date "${dateString}":`, e); return null; }
}


export default async function LandingPage() {
  let weekendActivities: Activity[] = [];
  let fetchError: string | null = null;

  try {
    const allActivities = await getActivities(); // Uses updated fetching logic
    const today = startOfDay(new Date());
    const upcomingSaturday = startOfDay(nextSaturday(today));
    const upcomingSunday = startOfDay(nextSunday(today));

    weekendActivities = allActivities.filter(activity => {
        const activityDate = parseActivityDate(activity.activityDate);
        if (!activityDate) return false;
        const activityDayStart = startOfDay(activityDate);
        return activityDayStart.getTime() === upcomingSaturday.getTime() ||
               activityDayStart.getTime() === upcomingSunday.getTime();
      })
      .slice(0, 3);
  } catch (error: any) {
    console.error("Failed to fetch/filter weekend activities:", error);
    fetchError = error.message || "Could not load featured activities.";
  }

  return (
    <main className="flex-1">
      {/* Hero Section (Keep as before with /playscouthero.png) */}
      <section className="bg-gradient-to-b from-orange-50 to-white px-4 py-10 md:py-14 lg:py-20 dark:from-gray-900 dark:to-gray-950">
        {/* ... Hero content ... */}
        <div className="container mx-auto"> <div className="grid items-center gap-8 md:grid-cols-2"> <div className="text-center md:text-left"> <h1 className="mb-3 text-3xl font-bold leading-tight tracking-tighter md:text-4xl lg:text-5xl text-gray-900 dark:text-gray-100"> Find the perfect activity for your kid—fast </h1> <p className="mb-6 text-lg text-gray-600 md:text-xl dark:text-gray-400"> Discover and explore the best local activities, classes, and camps for children of all ages. </p> <div className="flex flex-wrap gap-4 justify-center md:justify-start"> <Button size="lg" className="bg-orange-500 px-8 hover:bg-orange-600" asChild> <Link href="/activities"> Browse Activities <ArrowRight className="ml-2 h-5 w-5" /> </Link> </Button> <Button size="lg" variant="outline" className="border-green-600 text-green-600 hover:bg-green-50 hover:text-green-700 dark:border-green-500 dark:text-green-400 dark:hover:bg-gray-800 dark:hover:text-green-300" asChild> <Link href="/submit"> Submit Your Activity </Link> </Button> </div> </div> <div className="order-first md:order-last"> <div className="relative mx-auto aspect-video max-w-xl overflow-hidden rounded-lg shadow-lg"> <Image src="/playscouthero.png" alt="Children playing and having fun" fill style={{objectFit: "cover"}} priority /> </div> </div> </div> </div>
      </section>

      {/* Featured Activities Section */}
      <section id="featured-activities" className="px-4 py-12 md:py-16">
         <div className="container mx-auto">
           <h2 className="mb-8 text-center text-2xl font-bold md:text-3xl text-gray-800 dark:text-gray-100">This Weekend's Activities</h2>

           {fetchError && ( /* ... Error Alert ... */ <Alert variant="destructive" className="mb-6 max-w-lg mx-auto"><AlertCircle className="h-4 w-4" /><AlertTitle>Error Loading Activities</AlertTitle><AlertDescription>{fetchError}</AlertDescription></Alert>)}

           {!fetchError && weekendActivities.length > 0 && (
             <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
               {weekendActivities.map((activity) => (
                 <Card key={activity.id} className="flex flex-col overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 h-full dark:bg-gray-900 dark:border-gray-700">
                    <div className="relative h-48 w-full bg-muted dark:bg-gray-800">
                       <Image src={activity.imageURL || "/placeholder.svg"} alt={activity.name} fill style={{ objectFit: 'cover' }} className="rounded-t-lg" unoptimized={!activity.imageURL}/>
                    </div>
                    <CardContent className="p-4 flex-grow">
                       <h3 className="mb-2 text-lg font-semibold leading-tight text-gray-800 dark:text-white">{activity.name}</h3>
                       {activity.activityDate && (
                            <p className="text-sm font-medium text-orange-600 dark:text-orange-400 mb-1">
                                Date: {format(parseActivityDate(activity.activityDate)!, 'EEE, MMM d, yyyy')}
                            </p>
                       )}
                       <div className="space-y-1.5 text-sm text-gray-600 dark:text-gray-400">
                         {/* --- Re-added Age Range Display --- */}
                         <div className="flex items-center">
                            <Users className="mr-1.5 h-4 w-4 text-orange-500 flex-shrink-0" />
                            <span>{activity.ageRange}</span> {/* Uses data from Column J */}
                         </div>
                         {/* --- End Re-added Age Range --- */}
                         <div className="flex items-center"> <MapPin className="mr-1.5 h-4 w-4 text-orange-500 flex-shrink-0" /> <span>{activity.location}</span> </div>
                         <div className="flex items-center pt-1"> <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 border border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700"> {activity.category} </span> </div>
                       </div>
                    </CardContent>
                   <CardFooter className="border-t bg-gray-50 p-3 dark:bg-gray-800 dark:border-gray-700">
                       <Button variant="outline" className="w-full border-orange-500 text-orange-500 hover:bg-orange-50 hover:text-orange-600 dark:border-orange-400 dark:text-orange-400 dark:hover:bg-gray-700 dark:hover:text-orange-300" asChild>
                         <Link href={`/activities/${activity.id}`}>View Details</Link>
                       </Button>
                   </CardFooter>
                 </Card>
               ))}
             </div>
           )}

           {!fetchError && weekendActivities.length === 0 && ( /* ... No activities message ... */ <p className="text-center text-muted-foreground dark:text-gray-500">No activities found scheduled for this upcoming weekend ({format(upcomingSaturday, 'MM/dd')} - {format(upcomingSunday, 'MM/dd')}).</p> )}

           <div className="mt-10 text-center">
             {/* ... View All Button ... */} <Button className="bg-orange-500 hover:bg-orange-600" size="lg" asChild> <Link href="/activities"> View All Activities <ArrowRight className="ml-2 h-4 w-4" /> </Link> </Button>
           </div>
         </div>
      </section>

      {/* How It Works Section (Keep as before) */}
      <section id="how-it-works" className="bg-gray-50 px-4 py-12 md:py-16 dark:bg-gray-800">
         {/* ... How It Works content ... */}
          <div className="container mx-auto max-w-5xl"> <h2 className="mb-8 text-center text-2xl font-bold md:text-3xl text-gray-800 dark:text-gray-100">How PlayScout Works</h2> <div className="grid gap-8 md:grid-cols-3"> <div className="rounded-lg bg-white p-6 text-center shadow-md transition-transform hover:scale-105 dark:bg-gray-900"> <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-orange-500 dark:bg-orange-900/30 dark:text-orange-400"> <Search className="h-6 w-6" /> </div> <h3 className="mb-2 text-lg font-semibold dark:text-white">Search & Discover</h3> <p className="text-sm text-gray-600 dark:text-gray-400">Easily browse activities by age, location, or category using our simple filters.</p> </div> <div className="rounded-lg bg-white p-6 text-center shadow-md transition-transform hover:scale-105 dark:bg-gray-900"> <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-500 dark:bg-green-900/30 dark:text-green-400"> <Calendar className="h-6 w-6" /> </div> <h3 className="mb-2 text-lg font-semibold dark:text-white">Choose the Best Fit</h3> <p className="text-sm text-gray-600 dark:text-gray-400">View detailed descriptions and find the perfect match for your child's interests and schedule.</p> </div> <div className="rounded-lg bg-white p-6 text-center shadow-md transition-transform hover:scale-105 dark:bg-gray-900"> <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-orange-500 dark:bg-orange-900/30 dark:text-orange-400"> <ExternalLink className="h-6 w-6" /> </div> <h3 className="mb-2 text-lg font-semibold dark:text-white">Register Directly</h3> <p className="text-sm text-gray-600 dark:text-gray-400">Click the registration link to sign up quickly and easily with the activity provider.</p> </div> </div> </div>
      </section>

       {/* Waitlist Section (Keep as before) */}
       <section id="waitlist" className="bg-orange-50 px-4 py-10 md:py-12 dark:bg-orange-900/20">
         {/* ... Waitlist content using WaitlistForm and Contact Button ... */}
          <div className="container mx-auto max-w-2xl text-center"> <h2 className="mb-2 text-2xl font-bold md:text-3xl text-gray-900 dark:text-orange-100">Be the First to Know!</h2> <p className="mb-6 text-gray-600 dark:text-orange-200"> PlayScout is launching soon. Enter your email below to get notified when we arrive in your area. </p> <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-4"> <div className="w-full max-w-lg"> <WaitlistForm /> </div> <div className="shrink-0"> <Button variant="outline" className="border-orange-500 text-orange-500 hover:bg-orange-50 hover:text-orange-600 dark:border-orange-400 dark:text-orange-400 dark:hover:bg-gray-800 dark:hover:text-orange-300" asChild> <Link href="/contact"> <MessageSquare className="mr-2 h-4 w-4" /> Contact Us </Link> </Button> </div> </div> </div>
       </section>
    </main>
  );
}