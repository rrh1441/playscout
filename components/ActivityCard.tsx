// components/ActivityCard.tsx (or wherever your component is located)
import Image from "next/image";
import Link from "next/link";
import { Users, MapPin } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ActivityCardProps {
  activity: {
    id: string;
    name: string;
    ageRange?: string;
    location?: string;
    category?: string;
    imageURL?: string;
    description?: string;
    registrationLink?: string;
    activityDate?: string;
  };
}

export function ActivityCard({ activity }: ActivityCardProps) {
  // Default image handling
  const getImageUrl = (activity: any) => {
    if (!activity.imageURL || activity.imageURL === 'null' || activity.imageURL === '') {
      return `/api/placeholder/300/200?text=${encodeURIComponent(activity.name)}`;
    }
    return activity.imageURL;
  };

  return (
    <Card className="flex flex-col overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 h-full">
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
          
          {/* Added description */}
          {activity.description && (
            <div className="mt-3 text-sm text-gray-600">
              <p className="line-clamp-3">{activity.description}</p>
            </div>
          )}
        </div>
      </CardContent>
      
      {/* Registration button instead of View Details */}
      <CardFooter className="border-t bg-gray-50 p-3 dark:bg-gray-800">
        <Button 
          variant="outline" 
          className="w-full border-orange-500 text-orange-500 hover:bg-orange-50 hover:text-orange-600 dark:border-orange-400 dark:text-orange-400 dark:hover:bg-gray-700 dark:hover:text-orange-300" 
          asChild
        >
          <Link href={activity.registrationLink || '#'} target={activity.registrationLink && activity.registrationLink !== '#' ? "_blank" : "_self"} rel="noopener noreferrer">
            {activity.registrationLink && activity.registrationLink !== '#' ? 'Register' : 'View Details'}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default ActivityCard;