// components/ActivityCard.tsx
import Link from 'next/link';
import Image from 'next/image';
import { Activity } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, MapPin, Tag } from "lucide-react"; // Using Tag for category

interface ActivityCardProps {
    activity: Activity;
}

// Define category colors (adjust as needed)
const categoryColors: { [key: string]: string } = {
    "Sports": "bg-blue-100 text-blue-800 border-blue-200",
    "Arts": "bg-purple-100 text-purple-800 border-purple-200",
    "STEM": "bg-green-100 text-green-800 border-green-200",
    "Music": "bg-yellow-100 text-yellow-800 border-yellow-200",
    "Dance": "bg-pink-100 text-pink-800 border-pink-200",
    "General": "bg-gray-100 text-gray-800 border-gray-200",
    // Add more categories and their corresponding Tailwind classes
};

const defaultColor = "bg-gray-100 text-gray-800 border-gray-200";


export function ActivityCard({ activity }: ActivityCardProps) {
    const badgeColor = categoryColors[activity.category] || defaultColor;

    return (
        <Card className="flex flex-col overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 h-full">
             {/* Image */}
            <div className="relative h-48 w-full">
                 <Image
                    src={activity.imageURL || "/placeholder.svg"} // Use placeholder if no image
                    alt={activity.name}
                    fill // Use fill layout
                    style={{ objectFit: "cover" }} // Cover the area
                    className="rounded-t-lg"
                    // Consider adding sizes for optimization if using next/image with external URLs
                    // sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    unoptimized={!activity.imageURL} // Avoid optimization for placeholder
                />
            </div>

             {/* Content */}
            <CardContent className="p-4 flex-grow">
                <h3 className="mb-2 text-lg font-semibold leading-tight text-gray-800">{activity.name}</h3>
                <div className="space-y-1.5 text-sm text-gray-600">
                     <div className="flex items-center">
                        <Users className="mr-1.5 h-4 w-4 text-orange-500 flex-shrink-0" />
                        <span>{activity.ageRange}</span>
                    </div>
                    <div className="flex items-center">
                        <MapPin className="mr-1.5 h-4 w-4 text-orange-500 flex-shrink-0" />
                        <span>{activity.location}</span>
                    </div>
                    <div className="flex items-center pt-1">
                        <Badge variant="outline" className={`text-xs font-medium ${badgeColor}`}>
                            {activity.category}
                        </Badge>
                    </div>
                </div>
            </CardContent>

             {/* Footer Button */}
            <CardFooter className="border-t bg-gray-50 p-3">
                 <Link href={`/activities/${activity.id}`} className='w-full' passHref legacyBehavior>
                    <Button variant="outline" className="w-full border-orange-500 text-orange-500 hover:bg-orange-50 hover:text-orange-600">
                        View Details
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    );
}