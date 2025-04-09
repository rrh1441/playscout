// lib/types.ts
export interface Activity {
    id: string;
    name: string;
    ageRange: string;
    location: string;
    category: string;
    description: string;
    registrationLink: string;
    imageURL: string | null; // Allow null if image is optional
  }