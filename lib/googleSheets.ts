// lib/googleSheets.ts (Fixed Google Sheets API error)
import { google } from 'googleapis';
import { Activity } from './types';
// import { unstable_noStore as noStore } from 'next/cache'; // Keep if needed elsewhere, but remove call below

// --- Configuration (Updated with proper sheet reference) ---
const GOOGLE_SHEET_ID = process.env.GOOGLE_SHEET_ID_SUBMISSIONS;
const GOOGLE_CREDENTIALS_JSON = process.env.GOOGLE_CREDENTIALS;
const GOOGLE_APPLICATION_CREDENTIALS_PATH = process.env.GOOGLE_APPLICATION_CREDENTIALS_PATH;
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

// No quotes, just simple range reference
const ACTIVITIES_RANGE = 'A2:J'; 

// --- Auth Initialization (Keep as before) ---
let auth: any;
try { 
    if (!GOOGLE_SHEET_ID) { 
        throw new Error('Configuration Error: Missing GOOGLE_SHEET_ID_SUBMISSIONS environment variable'); 
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

// --- Normalization Function (Keep as before with correct indices) ---
const normalizeActivity = (row: any[], rowIndex: number): Activity | null => {
    if (!row || row.length < 2) return null;
    
    const id = row[0]?.toString().trim(); // Changed from 1 to 0 (column A)
    const name = row[1]?.toString().trim(); // Changed from 2 to 1 (column B)
    
    if (!id || !name) return null;
    
    return { 
        id: id, 
        name: name, 
        location: row[2]?.toString().trim() || 'N/A', // Changed from 3 to 2 (column C)
        category: row[3]?.toString().trim() || 'General', // Changed from 4 to 3 (column D)
        description: row[4]?.toString().trim() || 'No description.', // Changed from 5 to 4 (column E)
        registrationLink: row[5]?.toString().trim() || '#', // Changed from 6 to 5 (column F)
        imageURL: row[6]?.toString().trim() || null, // Changed from 7 to 6 (column G)
        activityDate: row[7]?.toString().trim() || null, // Changed from 8 to 7 (column H)
        ageRange: row[8]?.toString().trim() || 'N/A' // Changed from 9 to 8 (column I)
    };
};

// --- getActivities Function (Fixed) ---
export async function getActivities(): Promise<Activity[]> {
    // noStore(); // <--- REMOVED THIS LINE
    if (!auth || !sheets) { 
        console.error("getActivities: Auth or Sheets client not initialized."); 
        return []; 
    }

    console.log(`Fetching activities from sheet: ${GOOGLE_SHEET_ID}, range: ${ACTIVITIES_RANGE}`);
    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: GOOGLE_SHEET_ID,
            range: ACTIVITIES_RANGE, // Using simple range without sheet name
        });
        
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
        
        let specificError = 'Failed to fetch activities.'; 
        
        if (err.code === 404) { 
            specificError = `Sheet not found. Check GOOGLE_SHEET_ID_SUBMISSIONS (${GOOGLE_SHEET_ID}).`; 
        } else if (err.code === 403) { 
            specificError = `Permission denied for sheet (${GOOGLE_SHEET_ID}).`; 
        } else if (err.message.includes('Unable to parse range')) { 
            specificError = `Sheet range invalid ('${ACTIVITIES_RANGE}').`; 
        }
        
        console.error(specificError);
        return []; // Return empty array instead of throwing to prevent build failures
    }
}

// --- getActivityById Function (Updated to handle errors better) ---
export async function getActivityById(id: string): Promise<Activity | null> {
    console.log(`Attempting to find activity with ID: ${id}`); 
    
    try { 
        const activities = await getActivities(); 
        const activity = activities.find(act => act.id === id); 
        
        if (!activity) { 
            console.log(`Activity with ID ${id} not found.`); 
        } else { 
            console.log(`Found activity: ${activity.name}`); 
        } 
        
        return activity || null; 
    } catch (err: any) { 
        console.error(`Error retrieving activity by ID (${id}):`, err.message); 
        return null; 
    }
}