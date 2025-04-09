// app/contact/page.tsx
import Link from 'next/link';
import { ContactForm } from '@/components/ContactForm'; // Import the client component
import { MessageSquare, Calendar } from 'lucide-react';

export default function ContactPage() {
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
                         <Link href="/submit" className="text-sm font-medium hover:text-orange-500">Submit Activity</Link>
                         <Link href="/contact" className="text-sm font-medium text-orange-500">Contact</Link>
                    </nav>
                    <button className="md:hidden p-2"> {/* Add Sheet Trigger later */}
                         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
                    </button>
                 </div>
             </header>

            <main className="flex-1 px-4 py-10 md:py-16">
                <div className="container mx-auto max-w-4xl">
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