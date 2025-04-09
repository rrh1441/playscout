// lib/googleSheets.ts (Removed noStore from getActivities)
import { google } from 'googleapis';
import { Activity } from './types';
// import { unstable_noStore as noStore } from 'next/cache'; // Keep if needed elsewhere, but remove call below

// --- Configuration (Keep as before) ---
const GOOGLE_SHEET_ID = process.env.GOOGLE_SHEET_ID_SUBMISSIONS;
const GOOGLE_CREDENTIALS_JSON = process.env.GOOGLE_CREDENTIALS;
const GOOGLE_APPLICATION_CREDENTIALS_PATH = process.env.GOOGLE_APPLICATION_CREDENTIALS_PATH;
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const ACTIVITIES_SHEET_NAME = 'Form Responses 1';
const ACTIVITIES_RANGE = `${ACTIVITIES_SHEET_NAME}!A2:J`; // Correct range A-J

// --- Auth Initialization (Keep as before) ---
let auth: any;
try { /* ... same auth logic ... */
    if (!GOOGLE_SHEET_ID) { throw new Error('Configuration Error: Missing GOOGLE_SHEET_ID_SUBMISSIONS environment variable'); }
    if (GOOGLE_CREDENTIALS_JSON) { const credentials = JSON.parse(GOOGLE_CREDENTIALS_JSON); auth = new google.auth.GoogleAuth({ credentials, scopes: SCOPES }); }
    else if (GOOGLE_APPLICATION_CREDENTIALS_PATH) { auth = new google.auth.GoogleAuth({ keyFile: GOOGLE_APPLICATION_CREDENTIALS_PATH, scopes: SCOPES }); }
    else { throw new Error('Configuration Error: Missing Google credentials (GOOGLE_CREDENTIALS or GOOGLE_APPLICATION_CREDENTIALS_PATH).'); }
} catch (error: any) { console.error("Google Sheets Lib: Error initializing Google Auth:", error.message); auth = null; }
const sheets = auth ? google.sheets({ version: 'v4', auth }) : null;


// --- Normalization Function (Keep as before with correct indices) ---
const normalizeActivity = (row: any[], rowIndex: number): Activity | null => {
    if (!row || row.length < 2) return null;
    const id = row[1]?.toString().trim(); const name = row[2]?.toString().trim(); if (!id || !name) return null;
    return { id: id, name: name, location: row[3]?.toString().trim() || 'N/A', category: row[4]?.toString().trim() || 'General', description: row[5]?.toString().trim() || 'No description.', registrationLink: row[6]?.toString().trim() || '#', imageURL: row[7]?.toString().trim() || null, activityDate: row[8]?.toString().trim() || null, ageRange: row[9]?.toString().trim() || 'N/A' };
};

// --- getActivities Function ---
export async function getActivities(): Promise<Activity[]> {
    // noStore(); // <--- REMOVED THIS LINE
    if (!auth || !sheets) { console.error("getActivities: Auth or Sheets client not initialized."); return []; }

    console.log(`Workspaceing activities from sheet: ${GOOGLE_SHEET_ID}, range: ${ACTIVITIES_RANGE}`);
    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: GOOGLE_SHEET_ID,
            range: ACTIVITIES_RANGE,
        });
        const rows = response.data.values;
        if (!rows || rows.length === 0) { console.log('No activity data found.'); return []; }
        console.log(`Workspaceed ${rows.length} raw activity rows.`);
        const activities = rows
            .map(normalizeActivity)
            .filter((activity): activity is Activity => activity !== null);
        console.log(`Normalized ${activities.length} valid activities.`);
        return activities;
    } catch (err: any) {
        // ... Error handling remains the same ...
        console.error('Error fetching activities from Google Sheets:', err.message); let specificError = 'Failed to fetch activities.'; if (err.code === 404) { specificError = `Sheet not found. Check GOOGLE_SHEET_ID_SUBMISSIONS (${GOOGLE_SHEET_ID}).`; console.error(specificError); } else if (err.code === 403) { specificError = `Permission denied for sheet (${GOOGLE_SHEET_ID}).`; console.error(specificError); } else if (err.message.includes('Unable to parse range')) { specificError = `Activities sheet tab ('${ACTIVITIES_SHEET_NAME}') not found or range invalid ('${ACTIVITIES_RANGE}').`; console.error(specificError); } throw new Error(specificError);
    }
}

// --- getActivityById Function (Keep as before) ---
export async function getActivityById(id: string): Promise<Activity | null> {
    // ... same logic ...
    console.log(`Attempting to find activity with ID: ${id}`); try { const activities = await getActivities(); const activity = activities.find(act => act.id === id); if (!activity) { console.log(`Activity with ID ${id} not found.`); } else { console.log(`Found activity: ${activity.name}`); } return activity || null; } catch (err: any) { console.error(`Error retrieving activity by ID (${id}):`, err.message); return null; }
}