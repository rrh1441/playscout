// lib/types.ts (Should be correct now)
export interface Activity {
    id: string;
    name: string;
    ageRange: string;          // From Column J
    location: string;          // From Column D
    category: string;          // From Column E
    description: string;       // From Column F
    registrationLink: string;  // From Column G
    imageURL: string | null;     // From Column H
    activityDate: string | null; // From Column I
  }