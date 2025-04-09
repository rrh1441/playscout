// lib/debugging.ts - Utility functions for debugging Google Sheets API issues

/**
 * Logs environment configuration details to help debug API issues
 * Redacts sensitive information for security
 */
export function logEnvironmentConfig() {
    const isDebugMode = process.env.NEXT_PUBLIC_DEBUG_MODE === 'true';
    if (!isDebugMode) {
      console.log('Debug mode is not enabled. Set NEXT_PUBLIC_DEBUG_MODE=true to enable detailed logging.');
      return;
    }
  
    console.log('=== Environment Configuration ===');
    
    // Check Sheet ID
    const sheetId = process.env.GOOGLE_SHEET_ID_SUBMISSIONS;
    if (!sheetId) {
      console.error('ERROR: GOOGLE_SHEET_ID_SUBMISSIONS is not set');
    } else {
      // Only show first and last few characters for security
      const redactedSheetId = `${sheetId.substring(0, 4)}...${sheetId.substring(sheetId.length - 4)}`;
      console.log(`GOOGLE_SHEET_ID_SUBMISSIONS: ${redactedSheetId} (${sheetId.length} chars)`);
    }
    
    // Check credentials
    const hasCredentialsJson = !!process.env.GOOGLE_CREDENTIALS;
    const hasCredentialsPath = !!process.env.GOOGLE_APPLICATION_CREDENTIALS_PATH;
    
    console.log(`GOOGLE_CREDENTIALS: ${hasCredentialsJson ? 'Present' : 'Missing'}`);
    console.log(`GOOGLE_APPLICATION_CREDENTIALS_PATH: ${hasCredentialsPath ? 'Present' : 'Missing'}`);
    
    if (hasCredentialsJson) {
      try {
        const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS || '{}');
        
        // Only log non-sensitive parts of the credentials
        console.log('Credentials Information:');
        console.log(`- type: ${credentials.type || 'missing'}`);
        console.log(`- project_id: ${credentials.project_id || 'missing'}`);
        
        if (credentials.client_email) {
          // Only show domain part of the email for security
          const emailParts = credentials.client_email.split('@');
          console.log(`- client_email: ...@${emailParts[1] || 'missing'}`);
        } else {
          console.error('ERROR: client_email is missing in credentials');
        }
        
        // Check for critical fields
        const hasPrivateKey = !!credentials.private_key;
        console.log(`- private_key: ${hasPrivateKey ? 'Present' : 'MISSING (CRITICAL ERROR)'}`);
        
      } catch (error) {
        console.error('ERROR: Failed to parse GOOGLE_CREDENTIALS JSON:', error);
      }
    }
    
    console.log('============================');
  }
  
  /**
   * Creates a test connection to the Google Sheets API to verify credentials
   */
  export async function testGoogleSheetsConnection() {
    const isDebugMode = process.env.NEXT_PUBLIC_DEBUG_MODE === 'true';
    if (!isDebugMode) {
      console.log('Debug mode is not enabled. Set NEXT_PUBLIC_DEBUG_MODE=true to enable testing.');
      return;
    }
    
    console.log('=== Testing Google Sheets Connection ===');
    
    try {
      // Import google module within the function to avoid server/client conflicts
      const { google } = await import('googleapis');
      
      const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
      let auth;
      
      // Try to initialize auth with provided credentials
      if (process.env.GOOGLE_CREDENTIALS) {
        const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);
        auth = new google.auth.GoogleAuth({ credentials, scopes: SCOPES });
      } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS_PATH) {
        auth = new google.auth.GoogleAuth({ 
          keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS_PATH, 
          scopes: SCOPES 
        });
      } else {
        throw new Error('No credentials found. Set GOOGLE_CREDENTIALS or GOOGLE_APPLICATION_CREDENTIALS_PATH.');
      }
      
      // Get client info to verify that auth is working
      const authClient = await auth.getClient();
      console.log('✓ Auth client created successfully');
      
      // Try to get sheet metadata
      const sheets = google.sheets({ version: 'v4', auth });
      
      // Test if we can access the spreadsheet
      const spreadsheetId = process.env.GOOGLE_SHEET_ID_SUBMISSIONS;
      if (!spreadsheetId) {
        throw new Error('GOOGLE_SHEET_ID_SUBMISSIONS is not set');
      }
      
      console.log(`Testing access to spreadsheet: ${spreadsheetId}`);
      const response = await sheets.spreadsheets.get({
        spreadsheetId
      });
      
      if (response.data) {
        console.log('✓ Successfully accessed spreadsheet metadata');
        console.log(`Spreadsheet title: ${response.data.properties?.title}`);
        
        // List available sheets within the spreadsheet
        console.log('\nAvailable sheets:');
        const sheetList = response.data.sheets?.map(sheet => 
          sheet.properties?.title || 'Unnamed sheet'
        );
        
        if (sheetList && sheetList.length > 0) {
          sheetList.forEach((sheetName, index) => {
            console.log(`${index + 1}. ${sheetName}`);
          });
          
          // Check if our target sheet exists
          const targetSheet = 'Form Responses 1';
          if (sheetList.includes(targetSheet)) {
            console.log(`\n✓ Target sheet "${targetSheet}" exists`);
          } else {
            console.error(`\n✗ ERROR: Target sheet "${targetSheet}" not found!`);
            console.log(`Make sure your sheet is named EXACTLY "${targetSheet}" (case-sensitive)`);
          }
        } else {
          console.log('No sheets found in this spreadsheet');
        }
      }
      
      console.log('\n✓ Connection test completed successfully');
      
    } catch (error: any) {
      console.error('✗ Google Sheets connection test failed:');
      
      if (error.message.includes('invalid_grant')) {
        console.error('Authentication failed. This is likely due to:');
        console.error('1. The service account credentials have expired or been revoked');
        console.error('2. The clock on your system is incorrect');
      } else if (error.message.includes('Permission denied')) {
        console.error('Permission denied error. Make sure:');
        console.error('1. The service account email has been given access to the spreadsheet');
        console.error('2. The spreadsheet ID is correct');
      } else {
        console.error(error.message || error);
      }
      
      console.error('\nReview the error and update your configuration accordingly');
    }
    
    console.log('============================');
  }