// lib/dataFetching.ts - Updated to match new Google Sheets approach
import { Activity } from './types';
import { getActivities } from './googleSheets';

// Helper function to check if a date is this weekend
function isThisWeekend(dateStr: string | null): boolean {
  if (!dateStr) {
    console.log('Date string is null or empty');
    return false;
  }
  
  console.log(`Checking if date "${dateStr}" is this weekend`);
  
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
      console.log(`Invalid date: ${dateStr}`);
      return false;
    }
    
    const today = new Date();
    console.log(`Today: ${today.toISOString().split('T')[0]}`);
    
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
    
    console.log(`This Saturday: ${thisSaturday.toISOString().split('T')[0]}`);
    console.log(`This Sunday: ${thisSunday.toISOString().split('T')[0]}`);
    console.log(`Activity date: ${activityDate.toISOString().split('T')[0]}`);
    
    // Check if the activity date is this weekend
    activityDate.setHours(0, 0, 0, 0);
    
    // Compare dates using their time values
    const isWeekend = 
      activityDate.getTime() === thisSaturday.getTime() || 
      activityDate.getTime() === thisSunday.getTime();
    
    console.log(`Is weekend: ${isWeekend}`);
    return isWeekend;
  } catch (error) {
    console.error("Error parsing date:", error);
    return false;
  }
}

// Function to get the upcoming weekend activities
export async function getWeekendActivities(): Promise<Activity[]> {
  console.log("Starting getWeekendActivities");
  
  try {
    console.log("Fetching all activities");
    const allActivities = await getActivities();
    console.log(`Fetched ${allActivities.length} activities`);
    
    if (allActivities.length === 0) {
      console.log("No activities found, returning fallback activities");
      return getFallbackActivities();
    }
    
    // Log the first few activities for debugging
    allActivities.slice(0, 3).forEach((activity, index) => {
      console.log(`Activity ${index + 1}: ID=${activity.id}, Name=${activity.name}, Date=${activity.activityDate}`);
    });
    
    // Filter activities for the upcoming weekend
    console.log("Filtering for weekend activities");
    const weekendActivities = allActivities.filter(activity => {
      const isWeekend = isThisWeekend(activity.activityDate);
      return isWeekend;
    });
    
    console.log(`Found ${weekendActivities.length} weekend activities`);
    
    // If we have weekend activities, return the first 3
    if (weekendActivities.length > 0) {
      console.log("Returning weekend activities");
      return weekendActivities.slice(0, 3);
    }
    
    // If no weekend activities, log that we're falling back
    console.log("No weekend activities found, returning first 3 activities");
    return allActivities.slice(0, 3);
  } catch (error) {
    console.error("Error fetching weekend activities:", error);
    console.log("Returning fallback activities due to error");
    return getFallbackActivities();
  }
}

// Function to get the default/fallback activities if API fails
export function getFallbackActivities(): Activity[] {
  console.log("Using fallback activities");
  return [
    { 
      id: "1", 
      name: "Kids Soccer Stars", 
      ageRange: "4-6 years", 
      location: "City Park", 
      category: "Sports", 
      imageURL: "/placeholder.svg?height=200&width=300", // Use placeholder for safety
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
      imageURL: "/placeholder.svg?height=200&width=300", // Use placeholder for safety
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
      imageURL: "/placeholder.svg?height=200&width=300", // Use placeholder for safety
      description: "Introduction to coding concepts for kids.",
      registrationLink: "#",
      activityDate: null
    },
  ];
}