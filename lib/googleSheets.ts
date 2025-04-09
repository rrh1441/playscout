// lib/googleSheets.ts (Minimal Fix - Only fixes the Google Sheets connection)
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

// Normalize function - Adjust field indices based on your actual sheet structure
const normalizeActivity = (row: any[], rowIndex: number): Activity | null => {
    if (!row || row.length < 2) return null;
    
    // Start with index 0 (not 1) for the first column A
    const id = row[0]?.toString().trim();
    const name = row[1]?.toString().trim();
    
    if (!id || !name) return null;
    
    return { 
        id: id, 
        name: name, 
        location: row[2]?.toString().trim() || 'N/A', 
        category: row[3]?.toString().trim() || 'General', 
        description: row[4]?.toString().trim() || 'No description.', 
        registrationLink: row[5]?.toString().trim() || '#', 
        imageURL: row[6]?.toString().trim() || '/placeholder.svg?height=200&width=300', 
        activityDate: row[7]?.toString().trim() || null, 
        ageRange: row[8]?.toString().trim() || 'N/A' 
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
        const activities = rows
            .map((row, index) => normalizeActivity(row, index))
            .filter((activity): activity is Activity => activity !== null);
            
        console.log(`Normalized ${activities.length} valid activities.`);
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