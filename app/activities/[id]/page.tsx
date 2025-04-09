// app/activities/[id]/page.tsx
import { getActivityById } from '@/lib/googleSheets';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link'; // Import Link
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, MapPin, Tag, Calendar, ExternalLink } from 'lucide-react';
import { Metadata, ResolvingMetadata } from 'next';

interface ActivityPageProps {
  params: { id: string };
}

// Optional: Generate dynamic metadata
export async function generateMetadata(
  { params }: ActivityPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const activity = await getActivityById(params.id);

  if (!activity) {
    return {
      title: 'Activity Not Found | PlayScout',
      description: 'The requested activity could not be found.',
    }
  }

  return {
    title: `${activity.name} | PlayScout`,
    description: `Details about the ${activity.name} activity for kids aged ${activity.ageRange} in ${activity.location}. ${activity.description.substring(0, 100)}...`,
     // Add open graph data if needed
    // openGraph: {
    //   title: `${activity.name} | PlayScout`,
    //   description: `Details about the ${activity.name} activity...`,
    //   images: [activity.imageURL || '/placeholder-logo.svg'],
    // },
  }
}


export default async function ActivityPage({ params }: ActivityPageProps) {
  const activity = await getActivityById(params.id);

  if (!activity) {
    notFound(); // Triggers the not-found UI
  }

  // Define category colors (same as ActivityCard)
  const categoryColors: { [key: string]: string } = {
        "Sports": "bg-blue-100 text-blue-800 border-blue-200",
        "Arts": "bg-purple-100 text-purple-800 border-purple-200",
        "STEM": "bg-green-100 text-green-800 border-green-200",
        "Music": "bg-yellow-100 text-yellow-800 border-yellow-200",
        "Dance": "bg-pink-100 text-pink-800 border-pink-200",
        "General": "bg-gray-100 text-gray-800 border-gray-200",
  };
  const defaultColor = "bg-gray-100 text-gray-800 border-gray-200";
  const badgeColor = categoryColors[activity.category] || defaultColor;

  return (
     <div className="flex min-h-screen flex-col">
        {/* Re-use header or create a shared Header component */}
         <header className="sticky top-0 z-10 bg-white px-4 py-4 shadow-sm">
             <div className="container mx-auto flex items-center justify-between">
                 <Link href="/" className="flex items-center">
                     <span className="text-xl font-bold text-orange-500">PlayScout</span>
                 </Link>
                 <nav className="hidden space-x-6 md:flex">
                     <Link href="/activities" className="text-sm font-medium hover:text-orange-500">Activities</Link>
                     <Link href="/submit" className="text-sm font-medium hover:text-orange-500">Submit Activity</Link>
                     <Link href="/contact" className="text-sm font-medium hover:text-orange-500">Contact</Link>
                 </nav>
                  {/* Mobile Menu Button */}
                  <button className="md:hidden p-2"> {/* Add Sheet Trigger later */}
                     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
                  </button>
             </div>
         </header>

        <main className="flex-1 px-4 py-10 md:py-16">
            <div className="container mx-auto max-w-4xl">
                <div className="md:flex md:gap-8">
                    {/* Left Column (Image & Basic Info) */}
                     <div className="md:w-1/3 mb-6 md:mb-0">
                        <div className="relative aspect-square w-full overflow-hidden rounded-lg shadow-md mb-4">
                            <Image
                                src={activity.imageURL || '/placeholder.svg'}
                                alt={activity.name}
                                fill
                                style={{ objectFit: 'cover' }}
                                className="rounded-lg"
                                unoptimized={!activity.imageURL}
                             />
                        </div>
                        <div className="space-y-2 text-sm text-gray-700">
                             <div className="flex items-center">
                                <Users className="mr-2 h-4 w-4 text-orange-500 flex-shrink-0" />
                                <span>{activity.ageRange}</span>
                            </div>
                             <div className="flex items-center">
                                <MapPin className="mr-2 h-4 w-4 text-orange-500 flex-shrink-0" />
                                <span>{activity.location}</span>
                            </div>
                            <div className="flex items-center">
                                <Tag className="mr-2 h-4 w-4 text-orange-500 flex-shrink-0" />
                                 <Badge variant="outline" className={`text-xs font-medium ${badgeColor}`}>
                                     {activity.category}
                                 </Badge>
                             </div>
                        </div>
                     </div>

                     {/* Right Column (Title, Description, Register) */}
                    <div className="md:w-2/3">
                         <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">{activity.name}</h1>
                         <p className="text-gray-600 leading-relaxed mb-6 whitespace-pre-wrap">{activity.description}</p>

                         <a
                            href={activity.registrationLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex" // Make the link behave like a block for the button
                         >
                             <Button size="lg" className="bg-orange-500 hover:bg-orange-600">
                                <ExternalLink className="mr-2 h-5 w-5" />
                                Register Now
                             </Button>
                         </a>
                     </div>
                 </div>
            </div>
        </main>

         {/* Re-use footer */}
         <footer className="bg-gray-50 px-4 py-8 mt-auto">
             <div className="container mx-auto text-center text-sm text-gray-600">
                 © {new Date().getFullYear()} PlayScout. All rights reserved.
             </div>
         </footer>
     </div>
  );
}

// Optional: Add a not-found component if you want custom styling
// Create app/activities/[id]/not-found.tsx
// export default function NotFound() {
//   return <div>Activity not found!</div>
// }