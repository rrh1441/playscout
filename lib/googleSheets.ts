// lib/googleSheets.ts
import { google } from 'googleapis';
import { Activity } from './types'; // We'll create this type definition next

// Ensure environment variables are defined
const GOOGLE_SHEET_ID = process.env.GOOGLE_SHEET_ID;
const GOOGLE_CREDENTIALS_JSON = process.env.GOOGLE_CREDENTIALS;
const GOOGLE_APPLICATION_CREDENTIALS_PATH = process.env.GOOGLE_APPLICATION_CREDENTIALS;

if (!GOOGLE_SHEET_ID) {
    throw new Error('Missing GOOGLE_SHEET_ID environment variable');
}

// --- Authentication ---
let auth: any; // Use 'any' for flexibility between JSON key and file path

try {
    if (GOOGLE_CREDENTIALS_JSON) {
        // Vercel environment: Use credentials directly from env var
        const credentials = JSON.parse(GOOGLE_CREDENTIALS_JSON);
        auth = new google.auth.GoogleAuth({
            credentials,
            scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
        });
    } else if (GOOGLE_APPLICATION_CREDENTIALS_PATH) {
        // Local environment: Use credentials file path
        auth = new google.auth.GoogleAuth({
            keyFile: GOOGLE_APPLICATION_CREDENTIALS_PATH,
            scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
        });
    } else {
        throw new Error('Missing Google credentials. Set either GOOGLE_CREDENTIALS or GOOGLE_APPLICATION_CREDENTIALS.');
    }
} catch (error) {
    console.error("Error initializing Google Auth:", error);
    throw new Error('Failed to initialize Google Authentication. Check credentials format or path.');
}


const sheets = google.sheets({ version: 'v4', auth });

// --- Data Fetching and Normalization ---

const SHEET_NAME = 'Activities'; // Adjust if your sheet name is different
const RANGE = `${SHEET_NAME}!A2:H`; // Assumes header is in row 1, data starts in A2, covers up to column H

// Helper to normalize row data into an Activity object
const normalizeActivity = (row: any[]): Activity | null => {
    // Basic validation: Ensure essential fields are present
    // Adjust indices based on your actual sheet columns (A=0, B=1, etc.)
    const id = row[0]?.trim();
    const name = row[1]?.trim();

    if (!id || !name) {
        return null; // Skip rows without ID or Name
    }

    return {
        id: id,
        name: name,
        ageRange: row[2]?.trim() || 'N/A',
        location: row[3]?.trim() || 'N/A',
        category: row[4]?.trim() || 'General',
        description: row[5]?.trim() || 'No description provided.',
        registrationLink: row[6]?.trim() || '#', // Default to '#' if missing
        imageURL: row[7]?.trim() || null,        // Allow null for optional image
    };
};

export async function getActivities(): Promise<Activity[]> {
    console.log(`Workspaceing activities from sheet: ${GOOGLE_SHEET_ID}, range: ${RANGE}`);
    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: GOOGLE_SHEET_ID,
            range: RANGE,
        });

        const rows = response.data.values;
        if (!rows || rows.length === 0) {
            console.log('No data found in sheet.');
            return [];
        }

        console.log(`Workspaceed ${rows.length} raw rows.`);

        const activities = rows
            .map(normalizeActivity)
            .filter((activity): activity is Activity => activity !== null); // Type guard to filter out nulls

        console.log(`Normalized ${activities.length} valid activities.`);
        return activities;

    } catch (err: any) {
        console.error('Error fetching activities from Google Sheets:', err);
        // Provide a more specific error message if possible
        if (err.code === 404) {
             console.error(`Sheet not found. Check GOOGLE_SHEET_ID: ${GOOGLE_SHEET_ID}`);
        } else if (err.code === 403) {
             console.error(`Permission denied. Ensure the service account has access to the sheet: ${GOOGLE_SHEET_ID}`);
        }
        // Depending on your needs, you might want to return an empty array
        // or re-throw the error for the page to handle (e.g., show an error message)
        // For MVP, returning empty might be safer.
        return [];
        // throw new Error('Failed to fetch activities from Google Sheets');
    }
}

export async function getActivityById(id: string): Promise<Activity | null> {
    try {
        const activities = await getActivities();
        const activity = activities.find(act => act.id === id);
        return activity || null;
    } catch (err) {
        console.error(`Error fetching activity by ID (${id}):`, err);
        return null; // Return null on error
    }
}