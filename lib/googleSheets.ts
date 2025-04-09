// lib/googleSheets.ts (Corrected Env Vars)
import { google } from 'googleapis';
import { Activity } from './types';
import { unstable_noStore as noStore } from 'next/cache';

// --- Configuration ---
// Use the specific environment variable for the submissions/activities sheet ID
const GOOGLE_SHEET_ID = process.env.GOOGLE_SHEET_ID_SUBMISSIONS;
// Use GOOGLE_CREDENTIALS primarily
const GOOGLE_CREDENTIALS_JSON = process.env.GOOGLE_CREDENTIALS;
// Fallback for local dev
const GOOGLE_APPLICATION_CREDENTIALS_PATH = process.env.GOOGLE_APPLICATION_CREDENTIALS;

// Scope needed depends on usage; assuming read/write might be needed elsewhere.
// If ONLY reading activities here, 'spreadsheets.readonly' is safer.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

const ACTIVITIES_SHEET_NAME = 'Form Responses 1'; // *** IMPORTANT: Update if your actual sheet tab name is different ***
const ACTIVITIES_RANGE = `${ACTIVITIES_SHEET_NAME}!A2:I`; // *** ADJUST 'I' if you have more/fewer columns ***

// --- Auth Initialization ---
let auth: any;
try {
    if (!GOOGLE_SHEET_ID) {
        // Correctly reference the specific variable in the error
        throw new Error('Configuration Error: Missing GOOGLE_SHEET_ID_SUBMISSIONS environment variable');
    }
    // Prioritize GOOGLE_CREDENTIALS
    if (GOOGLE_CREDENTIALS_JSON) {
        const credentials = JSON.parse(GOOGLE_CREDENTIALS_JSON);
        auth = new google.auth.GoogleAuth({ credentials, scopes: SCOPES });
    // Use path as fallback
    } else if (GOOGLE_APPLICATION_CREDENTIALS_PATH) {
        auth = new google.auth.GoogleAuth({ keyFile: GOOGLE_APPLICATION_CREDENTIALS_PATH, scopes: SCOPES });
    } else {
        throw new Error('Configuration Error: Missing Google credentials (GOOGLE_CREDENTIALS or GOOGLE_APPLICATION_CREDENTIALS_PATH).');
    }
} catch (error: any) {
    console.error("Google Sheets Lib: Error initializing Google Auth:", error.message);
    // Don't assign sheets if auth failed
    auth = null;
    // Optional: Rethrow if you want loading activities to hard fail
    // throw new Error(`Failed to initialize Google Authentication: ${error.message}`);
}

const sheets = auth ? google.sheets({ version: 'v4', auth }) : null;

// --- Data Fetching Logic (Keep structure from 'broken' version) ---
const normalizeActivity = (row: any[], rowIndex: number): Activity | null => {
    if (!row || row.length < 2) return null;
    // Columns: A=Timestamp, B=ID, C=Name, D=Age, E=Loc, F=Cat, G=Desc, H=RegLink, I=ImgURL
    const id = row[1]?.toString().trim();
    const name = row[2]?.toString().trim();
    if (!id) return null; // Skip if no ID in Col B
    if (!name) {
        console.warn(`Skipping row ${rowIndex + 2} (ID: ${id}): Missing Name in Column C.`);
        return null;
    }
    return {
        id: id,
        name: name,
        ageRange: row[3]?.toString().trim() || 'N/A',       // Index 3 (D)
        location: row[4]?.toString().trim() || 'N/A',       // Index 4 (E)
        category: row[5]?.toString().trim() || 'General',   // Index 5 (F)
        description: row[6]?.toString().trim() || 'No description provided.', // Index 6 (G)
        registrationLink: row[7]?.toString().trim() || '#', // Index 7 (H)
        imageURL: row[8]?.toString().trim() || null,      // Index 8 (I)
    };
};

export async function getActivities(): Promise<Activity[]> {
    noStore(); // Keep dynamic fetching for activities if intended

    if (!auth || !sheets) {
        console.error("getActivities: Auth or Sheets client not initialized.");
        // Return empty or throw depending on desired page behavior on auth failure
        return [];
        // throw new Error("Server configuration error preventing activity fetch.");
    }

    // Use correct variable in log
    console.log(`Workspaceing activities from sheet: ${GOOGLE_SHEET_ID}, range: ${ACTIVITIES_RANGE}`);
    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: GOOGLE_SHEET_ID, // Use correct variable
            range: ACTIVITIES_RANGE,
        });

        const rows = response.data.values;
        if (!rows || rows.length === 0) {
            console.log('No activity data found in sheet.');
            return [];
        }
        console.log(`Workspaceed ${rows.length} raw activity rows.`);

        const activities = rows
            .map(normalizeActivity)
            .filter((activity): activity is Activity => activity !== null);

        console.log(`Normalized ${activities.length} valid activities.`);
        return activities;

    } catch (err: any) {
        console.error('Error fetching activities from Google Sheets:', err.message);
        let specificError = 'Failed to fetch activities from Google Sheets.';
         if (err.code === 404) {
            // Use correct variable in error message
             specificError = `Sheet not found. Check GOOGLE_SHEET_ID_SUBMISSIONS (${GOOGLE_SHEET_ID}).`;
             console.error(specificError);
         } else if (err.code === 403) {
            // Use correct variable in error message
             specificError = `Permission denied. Ensure the service account has read access to the sheet (${GOOGLE_SHEET_ID}).`;
             console.error(specificError);
         } else if (err.message.includes('Unable to parse range') || err.message.includes('Not Found')) {
             specificError = `Activities sheet tab ('${ACTIVITIES_SHEET_NAME}') not found or range invalid ('${ACTIVITIES_RANGE}). Verify Sheet ID, Tab Name, and Range.`;
             console.error(specificError);
         }
         // Re-throwing the specific error might be better for page-level error handling
        throw new Error(specificError);
        // return []; // Alternative: return empty on error
    }
}

// getActivityById remains the same, relies on getActivities
export async function getActivityById(id: string): Promise<Activity | null> {
    console.log(`Attempting to find activity with ID: ${id}`);
    try {
        const activities = await getActivities(); // This will now use the corrected GOOGLE_SHEET_ID_SUBMISSIONS
        const activity = activities.find(act => act.id === id);
        if (!activity) {
            console.log(`Activity with ID ${id} not found.`);
        } else {
            console.log(`Found activity: ${activity.name}`);
        }
        return activity || null;
    } catch (err: any) {
        // Log the error message passed up from getActivities
        console.error(`Error retrieving activity by ID (${id}):`, err.message);
        return null; // Return null if getActivities failed
    }
}