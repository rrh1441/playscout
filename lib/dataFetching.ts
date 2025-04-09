// lib/dataFetching.ts - Separate data fetching logic from the page component
import { Activity } from './types';
import { getActivities } from './googleSheets';

// Helper function to check if a date is this weekend
function isThisWeekend(dateStr: string | null): boolean {
  if (!dateStr) return false;
  
  try {
    // Parse the date (assuming MM/dd/yyyy format)
    const parts = dateStr.split('/');
    if (parts.length !== 3) return false;
    
    const month = parseInt(parts[0], 10) - 1; // JS months are 0-indexed
    const day = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);
    
    const activityDate = new Date(year, month, day);
    const today = new Date();
    
    // Get the current day of week
    const currentDay = today.getDay(); // 0 = Sunday, 6 = Saturday
    
    // Calculate days until next weekend
    const daysUntilSaturday = (6 - currentDay) % 7;
    const daysUntilSunday = (7 - currentDay) % 7;
    
    // Get this Saturday and Sunday dates
    const thisSaturday = new Date(today);
    thisSaturday.setDate(today.getDate() + daysUntilSaturday);
    thisSaturday.setHours(0, 0, 0, 0);
    
    const thisSunday = new Date(today);
    thisSunday.setDate(today.getDate() + daysUntilSunday);
    thisSunday.setHours(0, 0, 0, 0);
    
    // Check if the activity date is this weekend
    activityDate.setHours(0, 0, 0, 0);
    return (
      activityDate.getTime() === thisSaturday.getTime() || 
      activityDate.getTime() === thisSunday.getTime()
    );
  } catch (error) {
    console.error("Error parsing date:", error);
    return false;
  }
}

// Function to get the upcoming weekend activities
export async function getWeekendActivities(): Promise<Activity[]> {
  try {
    const allActivities = await getActivities();
    
    // Filter activities for the upcoming weekend
    const weekendActivities = allActivities.filter(activity => 
      isThisWeekend(activity.activityDate)
    );
    
    // If we have weekend activities, return the first 3
    if (weekendActivities.length > 0) {
      return weekendActivities.slice(0, 3);
    }
    
    // If no weekend activities, fall back to the first 3 activities
    return allActivities.slice(0, 3);
  } catch (error) {
    console.error("Error fetching weekend activities:", error);
    // Return empty array to prevent build failures
    return [];
  }
}

// Function to get the default/fallback activities if API fails
export function getFallbackActivities(): Activity[] {
  return [
    { 
      id: "1", 
      name: "Kids Soccer Stars", 
      ageRange: "4-6 years", 
      location: "City Park", 
      category: "Sports", 
      imageURL: "/placeholder.svg?height=200&width=300",
      description: "Introduction to soccer for young children.",
      registrationLink: "#",
      activityDate: null
    },
    { 
      id: "2", 
      name: "Creative Canvas Workshop", 
      ageRange: "7-10 years", 
      location: "Community Center", 
      category: "Arts", 
      imageURL: "/placeholder.svg?height=200&width=300",
      description: "Fun art projects for elementary school kids.",
      registrationLink: "#",
      activityDate: null
    },
    { 
      id: "3", 
      name: "Future Coders Camp", 
      ageRange: "8-12 years", 
      location: "Tech Hub Downtown", 
      category: "STEM", 
      imageURL: "/placeholder.svg?height=200&width=300",
      description: "Introduction to coding concepts for kids.",
      registrationLink: "#",
      activityDate: null
    },
  ];
}