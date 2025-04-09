// app/submit/page.tsx
import Link from 'next/link'; // Import Link

export default function SubmitPage() {
    // ** IMPORTANT: Replace this with your actual Google Form embed URL **
    const googleFormEmbedUrl = "https://docs.google.com/forms/d/e/YOUR_FORM_ID/viewform?embedded=true";
    // You get this URL from Google Forms: File -> Embed HTML -> copy the src attribute value

    return (
        <div className="flex min-h-screen flex-col">
            {/* Header */}
            <header className="sticky top-0 z-10 bg-white px-4 py-4 shadow-sm">
                <div className="container mx-auto flex items-center justify-between">
                     <Link href="/" className="flex items-center">
                         <span className="text-xl font-bold text-orange-500">PlayScout</span>
                     </Link>
                    <nav className="hidden space-x-6 md:flex">
                         <Link href="/activities" className="text-sm font-medium hover:text-orange-500">Activities</Link>
                         <Link href="/submit" className="text-sm font-medium text-orange-500">Submit Activity</Link>
                         <Link href="/contact" className="text-sm font-medium hover:text-orange-500">Contact</Link>
                     </nav>
                     <button className="md:hidden p-2"> {/* Add Sheet Trigger later */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
                     </button>
                </div>
            </header>

            <main className="flex-1 px-4 py-10 md:py-16">
                 <div className="container mx-auto max-w-4xl">
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
            </main>

            {/* Footer */}
            <footer className="bg-gray-50 px-4 py-8 mt-auto">
                <div className="container mx-auto text-center text-sm text-gray-600">
                    © {new Date().getFullYear()} PlayScout. All rights reserved.
                </div>
            </footer>
        </div>
    );
}