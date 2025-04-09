// components/ContactForm.tsx
'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast"; // Assuming you want toast notifications
import { Toaster } from '@/components/ui/toaster'; // Import toaster


export function ContactForm() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast(); // Initialize toast

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSubmitting(true);

        // --- MVP: Log to console ---
        console.log("Contact Form Submission:");
        console.log("Email:", email);
        console.log("Message:", message);
        // ----------------------------

        // Simulate network request
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Show success message using toast
        toast({
            title: "Message Sent!",
            description: "Thanks for reaching out. We'll get back to you if needed.",
            // variant: "success", // You might need to define a 'success' variant in toast.tsx
        });


        // Clear form
        setEmail('');
        setMessage('');
        setIsSubmitting(false);
    };

    return (
        <>
         <Toaster /> {/* Add Toaster component to render toasts */}
         <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label htmlFor="email" className="mb-1 block text-sm font-medium">
                    Your Email
                </Label>
                <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className='bg-white' // Ensure input has background for contrast
                />
            </div>
            <div>
                <Label htmlFor="message" className="mb-1 block text-sm font-medium">
                    Message
                </Label>
                <Textarea
                    id="message"
                    name="message"
                    placeholder="How can we help you?"
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    className='bg-white' // Ensure textarea has background for contrast
                />
            </div>
            <Button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-70"
                disabled={isSubmitting}
            >
                {isSubmitting ? 'Sending...' : 'Send Message'}
            </Button>
        </form>
        </>
    );
}