// app/debug/page.tsx - API Debug Page (only accessible in development mode)
import { logEnvironmentConfig, testGoogleSheetsConnection } from "@/lib/debugging";
import { getActivities } from "@/lib/googleSheets";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function DebugPage() {
  // Only run in development mode
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  if (!isDevelopment) {
    return (
      <div className="container mx-auto p-8">
        <h1 className="text-2xl font-bold mb-4">Debug Page</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          This page is only available in development mode.
        </div>
      </div>
    );
  }
  
  // Log environment configuration
  logEnvironmentConfig();
  
  // Test Google Sheets connection
  await testGoogleSheetsConnection();
  
  // Try to fetch activities
  let activities = [];
  let activitiesError = null;
  
  try {
    activities = await getActivities();
  } catch (error: any) {
    activitiesError = error.message || "Unknown error";
  }
  
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">API Debug Page</h1>
      
      <Card className="p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Environment Configuration</h2>
        <div className="bg-gray-100 p-4 rounded font-mono text-sm overflow-x-auto">
          <p>Check the server console for environment configuration logs.</p>
        </div>
      </Card>
      
      <Card className="p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Google Sheets Connection Test</h2>
        <div className="bg-gray-100 p-4 rounded font-mono text-sm overflow-x-auto">
          <p>Check the server console for connection test results.</p>
        </div>
      </Card>
      
      <Card className="p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Activities Fetch Test</h2>
        
        {activitiesError ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <strong>Error:</strong> {activitiesError}
          </div>
        ) : (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            <strong>Success!</strong> Retrieved {activities.length} activities.
          </div>
        )}
        
        <div className="bg-gray-100 p-4 rounded font-mono text-sm overflow-x-auto max-h-96">
          <pre>{JSON.stringify(activities, null, 2)}</pre>
        </div>
      </Card>
      
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Troubleshooting Steps</h2>
        
        <ol className="list-decimal pl-6 space-y-3">
          <li>Verify that your Google Sheets service account credentials are correct and up to date.</li>
          <li>Ensure the spreadsheet ID is correct and that the service account has access to it.</li>
          <li>Check that the sheet name <strong>'Form Responses 1'</strong> exists in your spreadsheet (exact case match).</li>
          <li>Confirm that your spreadsheet has data in the range A2:J.</li>
          <li>Make sure your environment variables are properly set in <code>.env.local</code>.</li>
        </ol>
        
        <div className="mt-6 bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
          <p>
            <strong>Note:</strong> Remember to restart your development server after making changes to environment variables.
          </p>
        </div>
      </div>
    </div>
  );
}