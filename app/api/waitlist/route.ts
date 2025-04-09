// app/api/waitlist/route.ts (Corrected Env Vars)
import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

// --- Configuration ---
// Uses the specific environment variable for the waitlist sheet ID
const GOOGLE_SHEET_ID_WAITLIST = process.env.GOOGLE_SHEET_ID_WAITLIST;
// Uses the GOOGLE_CREDENTIALS variable primarily
const GOOGLE_CREDENTIALS_JSON = process.env.GOOGLE_CREDENTIALS;
// Fallback for local development if GOOGLE_CREDENTIALS isn't set
const GOOGLE_APPLICATION_CREDENTIALS_PATH = process.env.GOOGLE_APPLICATION_CREDENTIALS_PATH;

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets']; // Write scope needed
const WAITLIST_SHEET_NAME = 'Sheet1'; // *** IMPORTANT: Update this to your ACTUAL waitlist sheet tab name ***
const WAITLIST_RANGE = `${WAITLIST_SHEET_NAME}!A:C`; // Assuming Columns: A=Timestamp, B=Email, C=Name

// --- Auth Initialization ---
let auth: any;
try {
    if (!GOOGLE_SHEET_ID_WAITLIST) {
        // Correctly reference the specific variable in the error
        throw new Error('Configuration Error: Missing GOOGLE_SHEET_ID_WAITLIST environment variable');
    }
    // Prioritize GOOGLE_CREDENTIALS
    if (GOOGLE_CREDENTIALS_JSON) {
        const credentials = JSON.parse(GOOGLE_CREDENTIALS_JSON);
        auth = new google.auth.GoogleAuth({ credentials, scopes: SCOPES });
    // Use path as fallback (useful for local dev)
    } else if (GOOGLE_APPLICATION_CREDENTIALS_PATH) {
        auth = new google.auth.GoogleAuth({ keyFile: GOOGLE_APPLICATION_CREDENTIALS_PATH, scopes: SCOPES });
    } else {
        throw new Error('Configuration Error: Missing Google credentials (GOOGLE_CREDENTIALS or GOOGLE_APPLICATION_CREDENTIALS_PATH).');
    }
} catch (error: any) {
    console.error("API Route (Waitlist): Error initializing Google Auth:", error.message);
    auth = null; // Ensure auth is null if initialization fails
}

const sheets = auth ? google.sheets({ version: 'v4', auth }) : null;

// --- Validation Functions (Keep as before) ---
function validateEmail(email: unknown): email is string {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function validateName(name: unknown): name is string {
  return typeof name === 'string' && name.trim().length > 0;
}

// --- POST Handler ---
export async function POST(request: NextRequest) {
    if (!auth || !sheets) {
       console.error("Waitlist API POST: Auth or Sheets client not initialized.");
       return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
    }

    try {
        const { name, email } = await request.json();

        // Validation
        if (!validateName(name)) {
            return NextResponse.json({ error: 'Name is required.' }, { status: 400 });
        }
        if (!validateEmail(email)) {
            return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
        }

        // Append data
        const timestamp = new Date().toISOString();
        const rowValues = [timestamp, email, name];

        console.log(`Appending to Waitlist (${GOOGLE_SHEET_ID_WAITLIST}, Tab: ${WAITLIST_SHEET_NAME}):`, rowValues);

        await sheets.spreadsheets.values.append({
            spreadsheetId: GOOGLE_SHEET_ID_WAITLIST, // Use correct variable
            range: WAITLIST_RANGE,
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
         if (error.code === 403) {
             friendlyError = 'Server permission error writing to the waitlist sheet.';
             // Use correct variable in error log
             console.error(`Permission denied for sheet: ${GOOGLE_SHEET_ID_WAITLIST}. Check service account access.`);
         } else if (error.code === 400 && error.message?.includes('Unable to parse range')) {
             friendlyError = `Waitlist sheet tab ('${WAITLIST_SHEET_NAME}') not found or range invalid. Verify Sheet ID, Tab Name, and Range ('${WAITLIST_RANGE}').`;
             console.error(friendlyError);
         } else if (error.code === 404) {
             // Use correct variable in error log
             friendlyError = `Waitlist spreadsheet not found. Verify GOOGLE_SHEET_ID_WAITLIST.`;
             console.error(friendlyError)
         }
        return NextResponse.json({ error: friendlyError }, { status: 500 });
    }
}