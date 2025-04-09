// app/submit/page.tsx (Updated with Correct Google Form URL)
import { Metadata } from 'next';
// Removed Alert imports as placeholder logic is removed

export const metadata: Metadata = {
 title: 'Submit Activity | PlayScout',
 description: 'Submit your kids activity, class, or camp to be featured on PlayScout.',
};

export default function SubmitPage() {
    // --- Updated Google Form Embed URL ---
    const googleFormEmbedUrl = "https://docs.google.com/forms/d/e/1FAIpQLScq8xBs33cs0gbQEk_0Vm52vj9gPWqGSxPRkDWA2_DQuFNytQ/viewform?embedded=true";
    // --- End Update ---

    // Assuming RootLayout provides Header/Footer
    return (
        <main className="flex-1 px-4 py-10 md:py-16">
             <div className="container mx-auto max-w-4xl">
                 <h1 className="mb-6 text-center text-3xl font-bold md:text-4xl">Submit an Activity</h1>
                  <p className="mb-8 text-center text-gray-600 dark:text-gray-400">
                      Want to feature your kids' activity, class, or camp on PlayScout? Fill out the form below!
                      <br />
                      <span className="text-xs">(Ensure your Google Form is set to accept responses)</span>
                  </p>

                   {/* Removed placeholder warning and conditional rendering */}
                   <div className="rounded-lg border shadow-md overflow-hidden bg-background dark:border-gray-700">
                       <iframe
                           src={googleFormEmbedUrl} // Use the correct URL
                           width="100%"
                           height="900" // Adjust height as needed
                           frameBorder="0"
                           marginHeight={0}
                           marginWidth={0}
                           title="Submit Activity Form"
                           className="min-h-[75vh] block" // Ensure it's a block element
                       >
                           Loading… {/* Fallback text */}
                       </iframe>
                   </div>
             </div>
         </main>
    );
}