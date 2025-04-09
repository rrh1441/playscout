// app/api/waitlist/route.ts (Name field removed)
import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

// --- Configuration ---
const GOOGLE_SHEET_ID_WAITLIST = process.env.GOOGLE_SHEET_ID_WAITLIST;
const GOOGLE_CREDENTIALS_JSON = process.env.GOOGLE_CREDENTIALS;
const GOOGLE_APPLICATION_CREDENTIALS_PATH = process.env.GOOGLE_APPLICATION_CREDENTIALS_PATH;
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const WAITLIST_SHEET_NAME = 'Sheet1'; // *** Ensure this matches your tab name ***
// *** UPDATED RANGE: Assuming Timestamp in A, Email in B ***
const WAITLIST_RANGE = `${WAITLIST_SHEET_NAME}!A:B`;

// --- Auth Initialization (Same as before) ---
let auth: any;
try {
    if (!GOOGLE_SHEET_ID_WAITLIST) {
        throw new Error('Configuration Error: Missing GOOGLE_SHEET_ID_WAITLIST environment variable');
    }
    if (GOOGLE_CREDENTIALS_JSON) {
        const credentials = JSON.parse(GOOGLE_CREDENTIALS_JSON);
        auth = new google.auth.GoogleAuth({ credentials, scopes: SCOPES });
    } else if (GOOGLE_APPLICATION_CREDENTIALS_PATH) {
        auth = new google.auth.GoogleAuth({ keyFile: GOOGLE_APPLICATION_CREDENTIALS_PATH, scopes: SCOPES });
    } else {
        throw new Error('Configuration Error: Missing Google credentials (GOOGLE_CREDENTIALS or GOOGLE_APPLICATION_CREDENTIALS_PATH).');
    }
} catch (error: any) {
    console.error("API Route (Waitlist): Error initializing Google Auth:", error.message);
    auth = null;
}

const sheets = auth ? google.sheets({ version: 'v4', auth }) : null;

// --- Validation ---
function validateEmail(email: unknown): email is string {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
// No longer need validateName

// --- POST Handler ---
export async function POST(request: NextRequest) {
    if (!auth || !sheets) {
       console.error("Waitlist API POST: Auth or Sheets client not initialized.");
       return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
    }

    try {
        // Only expect email now
        const { email } = await request.json();

        // --- Input Validation ---
        if (!validateEmail(email)) {
            return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
        }

        // --- Append data to Waitlist Google Sheet ---
        const timestamp = new Date().toISOString();
        // UPDATED: Only include timestamp and email
        const rowValues = [timestamp, email];

        console.log(`Appending to Waitlist (${GOOGLE_SHEET_ID_WAITLIST}, Tab: ${WAITLIST_SHEET_NAME}):`, rowValues);

        await sheets.spreadsheets.values.append({
            spreadsheetId: GOOGLE_SHEET_ID_WAITLIST,
            range: WAITLIST_RANGE, // Use updated A:B range
            valueInputOption: 'USER_ENTERED',
            insertDataOption: 'INSERT_ROWS',
            requestBody: {
                values: [rowValues],
            },
        });

        console.log("Successfully appended to Waitlist Sheet.");
        return NextResponse.json({ success: true, message: 'Successfully joined waitlist!' }, { status: 200 });

    } catch (error: any) {
        console.error('Waitlist API Error - Failed to process request:', error);
        let friendlyError = 'Failed to join waitlist due to a server issue.';
        if (error.code === 403) { /* ... permission error handling ... */ }
        else if (error.code === 400 && error.message?.includes('Unable to parse range')) { /* ... range error handling ... */ }
        else if (error.code === 404) { /* ... sheet not found error handling ... */ }
        return NextResponse.json({ error: friendlyError }, { status: 500 });
    }
}