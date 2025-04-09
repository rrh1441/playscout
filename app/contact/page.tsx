// app/contact/page.tsx (Simplified - No Form)
import { MessageSquare, Calendar } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
 title: 'Contact Us | PlayScout',
 description: 'Get in touch with PlayScout with your questions or feedback.',
};

// Assuming RootLayout provides Header/Footer
export default function ContactPage() {
    // --- Your Contact Email ---
    const contactEmail = "hello@playscout.example"; // Replace with your actual email

    return (
        <main className="flex-1 px-4 py-10 md:py-16">
            <div className="container mx-auto max-w-4xl">
                <h1 className="mb-4 text-center text-3xl font-bold md:text-4xl">Contact Us</h1>
                 <p className="mb-8 text-center text-gray-600 dark:text-gray-400">
                     Have questions or feedback? We'd love to hear from you!
                 </p>

                 <div className="rounded-lg border bg-muted/50 p-6 md:p-8 shadow-sm dark:bg-gray-800/50 dark:border-gray-700">
                     {/* Info Section */}
                     <div className="space-y-6 max-w-md mx-auto text-center md:text-left">
                         <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Get in Touch</h2>
                         <p className="text-gray-600 dark:text-gray-400">
                             The best way to reach us is by email. We typically respond within 24 business hours.
                         </p>
                         <div className="space-y-4 inline-block text-left"> {/* Centering trick for inline block */}
                             <div className="flex items-start">
                                 <MessageSquare className="mr-3 mt-1 h-5 w-5 text-orange-500 flex-shrink-0" />
                                 <div>
                                     <h3 className="font-medium text-gray-700 dark:text-gray-200">Email Us</h3>
                                     <a href={`mailto:${contactEmail}`} className="text-sm text-orange-600 hover:underline dark:text-orange-400">
                                         {contactEmail}
                                     </a>
                                 </div>
                             </div>
                             <div className="flex items-start">
                                 <Calendar className="mr-3 mt-1 h-5 w-5 text-orange-500 flex-shrink-0" />
                                 <div>
                                     <h3 className="font-medium text-gray-700 dark:text-gray-200">Availability</h3>
                                      {/* Update Timezone */}
                                     <p className="text-sm text-gray-600 dark:text-gray-400">Monday - Friday, 9 AM - 5 PM (Your Timezone)</p>
                                 </div>
                             </div>
                         </div>
                     </div>
                 </div>
             </div>
         </main>
    );
}