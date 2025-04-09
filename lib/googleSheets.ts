// lib/googleSheets.ts (Fixed for correct env vars)
import { google } from 'googleapis';
import { Activity } from './types';

// Try both possible environment variables for the spreadsheet ID
const GOOGLE_SHEET_ID = process.env.GOOGLE_SHEET_ID_SUBMISSIONS || process.env.GOOGLE_SHEET_ID;
const GOOGLE_CREDENTIALS_JSON = process.env.GOOGLE_CREDENTIALS;
const GOOGLE_APPLICATION_CREDENTIALS_PATH = process.env.GOOGLE_APPLICATION_CREDENTIALS_PATH;
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

// Log which sheet ID we're using to help with debugging
console.log("Using sheet ID:", GOOGLE_SHEET_ID ? GOOGLE_SHEET_ID.substring(0, 5) + "..." : "MISSING");

// Auth initialization
let auth: any;
try { 
    if (!GOOGLE_SHEET_ID) { 
        throw new Error('Configuration Error: Missing sheet ID environment variable. Check GOOGLE_SHEET_ID or GOOGLE_SHEET_ID_SUBMISSIONS.'); 
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
        throw new Error('Configuration Error: Missing Google credentials (GOOGLE_CREDENTIALS or GOOGLE_APPLICATION_CREDENTIALS_PATH).'); 
    }
} catch (error: any) { 
    console.error("Google Sheets Lib: Error initializing Google Auth:", error.message); 
    auth = null; 
}
const sheets = auth ? google.sheets({ version: 'v4', auth }) : null;

// Normalize function maps raw Google Sheets rows to Activity objects
const normalizeActivity = (row: any[]): Activity | null => {
    if (!row || row.length < 2) return null;
    
    // Try to extract data safely with fallbacks
    const id = String(row[0] || '').trim();
    const name = String(row[1] || '').trim();
    
    if (!id || !name) return null;
    
    return { 
        id, 
        name, 
        location: String(row[2] || '').trim() || 'Location TBD', 
        category: String(row[3] || '').trim() || 'General', 
        description: String(row[4] || '').trim() || 'No description available.', 
        registrationLink: String(row[5] || '').trim() || '#', 
        imageURL: String(row[6] || '').trim() || '/placeholder.svg?height=200&width=300', 
        activityDate: String(row[7] || '').trim() || null, 
        ageRange: String(row[8] || '').trim() || 'All ages' 
    };
};

// Get all activities
export async function getActivities(): Promise<Activity[]> {
    if (!auth || !sheets) { 
        console.error("getActivities: Auth or Sheets client not initialized."); 
        return []; 
    }

    try {
        // First try to get spreadsheet metadata to see available sheets
        console.log(`Attempting to access spreadsheet: ${GOOGLE_SHEET_ID}`);
        const metadata = await sheets.spreadsheets.get({
            spreadsheetId: GOOGLE_SHEET_ID
        });
        
        // Get all sheet names from the spreadsheet
        const sheetNames = metadata.data.sheets?.map(s => s.properties?.title) || [];
        console.log("Available sheets:", sheetNames);
        
        // Try multiple potential sheet names
        const potentialSheetNames = [
            'Form Responses 1', 
            'Sheet1', 
            'Activities',
            ...sheetNames // Add any other sheet names from the spreadsheet
        ];
        
        let rows = null;
        let usedSheetName = '';
        
        // Try each potential sheet name until we find data
        for (const sheetName of potentialSheetNames) {
            try {
                console.log(`Trying to read from sheet: ${sheetName}`);
                const response = await sheets.spreadsheets.values.get({
                    spreadsheetId: GOOGLE_SHEET_ID,
                    range: `${sheetName}!A2:J`
                });
                
                if (response.data.values && response.data.values.length > 0) {
                    rows = response.data.values;
                    usedSheetName = sheetName;
                    console.log(`Found data in sheet: ${sheetName}`);
                    break;
                }
            } catch (error) {
                console.log(`Failed to read from sheet: ${sheetName}`);
                // Continue to the next sheet name
            }
        }
        
        if (!rows || rows.length === 0) { 
            console.log('No activity data found in any sheet.'); 
            return []; 
        }
        
        console.log(`Fetched ${rows.length} raw activity rows from ${usedSheetName}.`);
        
        // Transform the raw data into Activity objects
        const activities = rows
            .map(normalizeActivity)
            .filter((activity): activity is Activity => activity !== null);
            
        console.log(`Normalized ${activities.length} valid activities.`);
        
        // Log first activity for debugging
        if (activities.length > 0) {
            console.log("First activity sample:", JSON.stringify(activities[0]));
        }
        
        return activities;
    } catch (err: any) {
        console.error('Error fetching activities from Google Sheets:', err.message); 
        
        // More detailed error messages
        if (err.code === 404) { 
            console.error(`Sheet not found. Check GOOGLE_SHEET_ID (${GOOGLE_SHEET_ID}).`); 
        } else if (err.code === 403) { 
            console.error(`Permission denied for sheet (${GOOGLE_SHEET_ID}). Make sure your service account has access.`); 
        }
        
        return []; // Return empty array
    }
}

// Get a specific activity by ID
export async function getActivityById(id: string): Promise<Activity | null> {
    try { 
        const activities = await getActivities(); 
        const activity = activities.find(act => act.id === id); 
        
        if (!activity) { 
            console.log(`Activity with ID ${id} not found.`); 
        }
        
        return activity || null; 
    } catch (err: any) { 
        console.error(`Error retrieving activity by ID (${id}):`, err.message); 
        return null; 
    }
}