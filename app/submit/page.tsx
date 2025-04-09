// app/submit/page.tsx
// Link import removed as it's no longer needed here for Header

export default function SubmitPage() {
    // ** IMPORTANT: Replace this with your actual Google Form embed URL **
    // Example ID - replace YOUR_FORM_ID
    const googleFormEmbedUrl = "https://docs.google.com/forms/d/e/1FAIpQLSc_FAKE_ID_REPLACE_ME/viewform?embedded=true";
    // You get this URL from Google Forms: File -> Share -> Embed HTML -> copy the src attribute value

    return (
        // Removed outer div and header/footer
        // The main tag is now provided by the RootLayout
         <div className="container mx-auto max-w-4xl px-4 py-10 md:py-16"> {/* Added container and padding here */}
             <h1 className="mb-6 text-center text-3xl font-bold md:text-4xl">Submit an Activity to PlayScout</h1>
              <p className="mb-8 text-center text-gray-600">
                  Want to feature your kids' activity, class, or camp on PlayScout? Fill out the form below!
              </p>
             <div className="rounded-lg border shadow-md overflow-hidden">
                 <iframe
                     src={googleFormEmbedUrl}
                     width="100%"
                     height="800" // Adjust height as needed
                     frameBorder="0"
                     marginHeight={0}
                     marginWidth={0}
                     title="Submit Activity Form"
                     className="min-h-[70vh]" // Ensure it takes reasonable space
                 >
                     Loading…
                 </iframe>
             </div>
         </div>
    );
}