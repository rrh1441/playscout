// app/contact/page.tsx
// Link import removed as it's no longer needed here for Header
import { ContactForm } from '@/components/ContactForm'; // Import the client component
import { MessageSquare, Calendar } from 'lucide-react';

export default function ContactPage() {
    return (
        // Removed outer div and header/footer
        // The main tag is now provided by the RootLayout
        <div className="container mx-auto max-w-4xl px-4 py-10 md:py-16"> {/* Added container and padding here */}
            <h1 className="mb-4 text-center text-3xl font-bold md:text-4xl">Contact Us</h1>
            <p className="mb-8 text-center text-gray-600">
                Have questions or feedback? We'd love to hear from you!
            </p>

            <div className="grid gap-10 rounded-lg border bg-gray-50/50 p-6 md:grid-cols-2 md:p-8 shadow-sm">
                {/* Left Side: Info */}
                <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-800">Get in Touch</h2>
                    <p className="text-gray-600">
                        Fill out the form, or use the contact details below. We typically respond within 24 business hours.
                    </p>
                    <div className="space-y-4">
                         <div className="flex items-start">
                             <MessageSquare className="mr-3 mt-1 h-5 w-5 text-orange-500 flex-shrink-0" />
                             <div>
                                 <h3 className="font-medium text-gray-700">Email Us</h3>
                                 {/* Replace with your actual email */}
                                 <a href="mailto:hello@playscout.example" className="text-sm text-orange-600 hover:underline">
                                     hello@playscout.example
                                 </a>
                             </div>
                         </div>
                         <div className="flex items-start">
                             <Calendar className="mr-3 mt-1 h-5 w-5 text-orange-500 flex-shrink-0" />
                             <div>
                                 <h3 className="font-medium text-gray-700">Availability</h3>
                                 <p className="text-sm text-gray-600">Monday - Friday, 9 AM - 5 PM (PST)</p>
                             </div>
                         </div>
                     </div>
                </div>

                {/* Right Side: Form */}
                 <div>
                    <ContactForm /> {/* Render the client component */}
                 </div>
            </div>
        </div>
    );
}