// lib/googleSheets.ts (Fixed Field Mapping based on screenshot)
import { google } from 'googleapis';
import { Activity } from './types';

// Configuration - Try multiple possible sheet IDs
const GOOGLE_SHEET_ID = process.env.GOOGLE_SHEET_ID || process.env.GOOGLE_SHEET_ID_SUBMISSIONS;
const GOOGLE_CREDENTIALS_JSON = process.env.GOOGLE_CREDENTIALS;
const GOOGLE_APPLICATION_CREDENTIALS_PATH = process.env.GOOGLE_APPLICATION_CREDENTIALS_PATH;
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

// Auth initialization
let auth: any;
try { 
    if (!GOOGLE_SHEET_ID) { 
        throw new Error('Configuration Error: Missing sheet ID environment variable'); 
    }
    if (GOOGLE_CREDENTIALS_JSON) { 
        const credentials = JSON.parse(GOOGLE_CREDENTIALS_JSON); 
        auth = new google.auth.GoogleAuth({ credentials, scopes: SCOPES }); 
    }
    else if (GOOGLE_APPLICATION_CREDENTIALS_PATH) { 
        auth = new google.auth.GoogleAuth({ 
            keyFile: GOOGLE_APPLICATION_CREDENTIALS_PATH, 
            scopes: SCOPES 
        }); 
    }
    else { 
        throw new Error('Configuration Error: Missing Google credentials'); 
    }
} catch (error: any) { 
    console.error("Google Sheets Lib: Error initializing Google Auth:", error.message); 
    auth = null; 
}
const sheets = auth ? google.sheets({ version: 'v4', auth }) : null;

// FIXED normalizeActivity function - Based on your screenshot
const normalizeActivity = (row: any[], rowIndex: number): Activity | null => {
    if (!row || row.length < 3) return null;
    
    // Based on your screenshot, it appears the columns are:
    // Column A: ID (showing as "activity-0003")
    // Column B: Date (showing as "4/13/2025")
    // Column C: Title (showing as "Sunday Pony Rides at Marin Country Mart")
    // Column D: Location (showing as "2257 Larkspur Landing Cir, Larkspur, CA 94939")
    
    const id = row[0]?.toString().trim();
    const activityDate = row[1]?.toString().trim();
    const name = row[2]?.toString().trim(); // This should be the actual title
    const location = row[3]?.toString().trim();
    
    if (!id || !name) return null;
    
    return { 
        id: id,  // Column A - ID (e.g., "activity-0003")
        name: name, // Column C - Title (e.g., "Sunday Pony Rides at Marin Country Mart")
        location: location || 'Location TBD', // Column D - Location
        category: row[4]?.toString().trim() || 'General', // Column E - Category (assuming)
        description: row[5]?.toString().trim() || 'No description available.', // Column F - Description (assuming)
        registrationLink: row[6]?.toString().trim() || '#', // Column G - Registration Link (assuming)
        imageURL: row[7]?.toString().trim() || '/placeholder.svg?height=200&width=300', // Column H - Image URL (assuming)
        activityDate: activityDate || null, // Column B - Date (e.g., "4/13/2025")
        ageRange: row[8]?.toString().trim() || 'All ages' // Column I - Age Range (assuming)
    };
};

// Get all activities - Try different approaches to access the sheet
export async function getActivities(): Promise<Activity[]> {
    if (!auth || !sheets) { 
        console.error("getActivities: Auth or Sheets client not initialized."); 
        return []; 
    }

    try {
        // Try different ways to access the sheet
        
        // Method 1: Try getting all values (without specifying sheet name)
        let response;
        try {
            console.log("Attempting to fetch from sheet ID:", GOOGLE_SHEET_ID);
            response = await sheets.spreadsheets.values.get({
                spreadsheetId: GOOGLE_SHEET_ID,
                range: 'A2:J',
            });
        } catch (e) {
            console.log("First attempt failed, trying with sheet name");
            
            // Method 2: Try to get sheet names first
            const metadata = await sheets.spreadsheets.get({
                spreadsheetId: GOOGLE_SHEET_ID
            });
            
            const sheetName = metadata.data.sheets?.[0]?.properties?.title || 'Sheet1';
            console.log(`Found sheet name: ${sheetName}`);
            
            // Method 3: Try with specific sheet name
            response = await sheets.spreadsheets.values.get({
                spreadsheetId: GOOGLE_SHEET_ID,
                range: `${sheetName}!A2:J`,
            });
        }
        
        const rows = response.data.values;
        if (!rows || rows.length === 0) { 
            console.log('No activity data found.'); 
            return []; 
        }
        
        console.log(`Fetched ${rows.length} raw activity rows.`);
        
        // Log first row to help debug
        if (rows.length > 0) {
            console.log("First row sample:", rows[0]);
        }
        
        const activities = rows
            .map((row, index) => normalizeActivity(row, index))
            .filter((activity): activity is Activity => activity !== null);
            
        console.log(`Normalized ${activities.length} valid activities.`);
        
        // Log first activity to verify mapping
        if (activities.length > 0) {
            console.log("First normalized activity:", activities[0]);
        }
        
        return activities;
    } catch (err: any) {
        console.error('Error fetching activities from Google Sheets:', err.message); 
        return []; // Return empty array to prevent build failures
    }
}

// Get a specific activity by ID
export async function getActivityById(id: string): Promise<Activity | null> {
    try { 
        const activities = await getActivities(); 
        const activity = activities.find(act => act.id === id); 
        return activity || null; 
    } catch (err: any) { 
        console.error(`Error retrieving activity by ID (${id}):`, err.message); 
        return null; 
    }
}