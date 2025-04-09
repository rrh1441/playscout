// components/WaitlistForm.tsx
'use client';

import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from 'lucide-react';

export function WaitlistForm() {
    const [name, setName] = useState(''); // Name is now required
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // Basic frontend check - ensure fields aren't empty
        if (!name.trim() || !email.trim()) {
            setError("Both name and email are required.");
            toast.error("Missing Information", {
                description: "Please provide both your name and email.",
                duration: 5000,
           });
            return;
        }

        setIsSubmitting(true);
        setError(null);
        setSuccess(false);

        try {
            const response = await fetch('/api/waitlist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                 body: JSON.stringify({ name: name, email: email }), // Send name and email
            });

            const result = await response.json();

            if (!response.ok) {
                // Use error message from API response if available
                throw new Error(result.error || `HTTP error! status: ${response.status}`);
            }

            toast.success("You're on the list! 🎉", {
                description: "We'll notify you when PlayScout launches.",
                duration: 5000,
            });
            setSuccess(true);
            setName(''); // Clear name field
            setEmail(''); // Clear email field

        } catch (error: any) {
            const errorMessage = error.message || "Failed to join. Please try again.";
            console.error("Waitlist form error:", error);
            setError(errorMessage); // Display error near the form
            toast.error("Submission Failed", {
                 description: errorMessage,
                 duration: 7000,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Display success message instead of the form
    if (success) {
        return (
            <div className="text-center text-green-700 font-medium bg-green-50 p-4 rounded-md border border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700">
                Thanks for joining the waitlist! We'll be in touch.
            </div>
        );
    }

    // Form structure adjusted for required Name and Email side-by-side on larger screens
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-2">
                <div className="flex-grow">
                    <Label htmlFor="waitlist-name" className="sr-only">Name</Label>
                    <Input
                        id="waitlist-name"
                        type="text"
                        placeholder="Your Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required // HTML required attribute
                        disabled={isSubmitting}
                        className="bg-white dark:bg-black" // Added dark mode background
                        aria-describedby="waitlist-error" // Describe by error message
                        aria-invalid={!!error} // Indicate invalid state if error exists
                    />
                </div>
                 <div className="flex-grow">
                    <Label htmlFor="waitlist-email" className="sr-only">Email</Label>
                    <Input
                        id="waitlist-email"
                        type="email"
                        placeholder="Your Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required // HTML required attribute
                        disabled={isSubmitting}
                        className="bg-white dark:bg-black" // Added dark mode background
                        aria-describedby="waitlist-error"
                        aria-invalid={!!error}
                    />
                </div>
                <Button
                    type="submit"
                    className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 disabled:opacity-70 shrink-0" // shrink-0 prevents button squishing
                    disabled={isSubmitting || !name || !email} // Disable if submitting or fields empty
                >
                    {isSubmitting ? (
                         <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Working...
                         </>
                     ) : (
                        'Join Waitlist'
                     )}
                </Button>
            </div>
             {/* Display error below the input row */}
            {error && <p id="waitlist-error" className="text-sm text-destructive text-center sm:text-left">{error}</p>}
        </form>
    );
}