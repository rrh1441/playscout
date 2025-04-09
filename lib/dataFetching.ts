// lib/dataFetching.ts - With better fallbacks
import { Activity } from './types';
import { getActivities } from './googleSheets';

// Helper function to check if a date is this weekend
function isThisWeekend(dateStr: string | null): boolean {
  if (!dateStr) {
    return false;
  }
  
  try {
    // Parse the date (try multiple formats)
    let activityDate: Date | null = null;
    
    // Try MM/dd/yyyy format
    if (dateStr.match(/^\d{1,2}\/\d{1,2}\/\d{4}$/)) {
      const parts = dateStr.split('/');
      const month = parseInt(parts[0], 10) - 1;
      const day = parseInt(parts[1], 10);
      const year = parseInt(parts[2], 10);
      activityDate = new Date(year, month, day);
    } 
    // Try yyyy-MM-dd format
    else if (dateStr.match(/^\d{4}-\d{1,2}-\d{1,2}$/)) {
      activityDate = new Date(dateStr);
    }
    // Try different locales
    else {
      activityDate = new Date(dateStr);
    }
    
    if (isNaN(activityDate.getTime())) {
      return false;
    }
    
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
    
    // Compare dates using their time values
    return (
      activityDate.getTime() === thisSaturday.getTime() || 
      activityDate.getTime() === thisSunday.getTime()
    );
  } catch (error) {
    return false;
  }
}

// Function to get the upcoming weekend activities
export async function getWeekendActivities(): Promise<Activity[]> {
  try {
    const allActivities = await getActivities();
    
    // If no activities fetched, return fallbacks
    if (!allActivities || allActivities.length === 0) {
      return getFallbackActivities();
    }
    
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
    return getFallbackActivities();
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
      // Use the Next.js API placeholder endpoint for guaranteed working images
      imageURL: "/api/placeholder/300/200?text=Soccer", 
      description: "Introduction to soccer for young children. Learn basic skills through fun games and activities.",
      registrationLink: "#",
      activityDate: null
    },
    { 
      id: "2", 
      name: "Creative Canvas Workshop", 
      ageRange: "7-10 years", 
      location: "Community Center", 
      category: "Arts", 
      imageURL: "/api/placeholder/300/200?text=Art+Workshop", 
      description: "Fun art projects for elementary school kids. Explore different materials and techniques.",
      registrationLink: "#",
      activityDate: null
    },
    { 
      id: "3", 
      name: "Future Coders Camp", 
      ageRange: "8-12 years", 
      location: "Tech Hub Downtown", 
      category: "STEM", 
      imageURL: "/api/placeholder/300/200?text=Coding+Camp", 
      description: "Introduction to coding concepts for kids. Create simple games and animations.",
      registrationLink: "#",
      activityDate: null
    },
  ];
}