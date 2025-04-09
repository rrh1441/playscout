'use client';

import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from 'lucide-react';

// Define loading indicator outside the component to avoid nested component definition
const LoadingIndicator = () => (
  <>
    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Working...
  </>
);

export function WaitlistForm() {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        console.log("handleSubmit triggered");
        event.preventDefault();
        console.log("Default prevented");

        // Log current state values BEFORE validation
        console.log("Current state before validation:", { email: email.trim() });

        // Basic frontend check - ensure email isn't empty
        if (!email.trim()) {
            console.log("Validation failed: Email is empty.");
            setError("Email is required.");
            toast.error("Missing Information", {
                description: "Please provide your email address.",
                duration: 5000,
           });
            return; // Stop execution
        }
        console.log("Validation passed.");

        setIsSubmitting(true);
        setError(null);
        setSuccess(false);
        console.log("Set isSubmitting = true");

        try {
            // Only send email in payload
            const payload = { email: email };
            console.log("Attempting fetch to /api/waitlist with payload:", payload);

            const response = await fetch('/api/waitlist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                 body: JSON.stringify(payload),
            });

            console.log("Fetch response received:", { status: response.status, ok: response.ok });

            const result = await response.json();
            console.log("Parsed fetch response JSON:", result);

            if (!response.ok) {
                console.error("Fetch response not OK:", result.error || `HTTP ${response.status}`);
                throw new Error(result.error || `HTTP error! status: ${response.status}`);
            }

            console.log("Fetch successful. Showing success toast.");
            toast.success("You're on the list! 🎉", {
                description: "We'll notify you when PlayScout launches.",
                duration: 5000,
            });
            setSuccess(true);
            setEmail(''); // Clear email field

        } catch (error: any) {
            const errorMessage = error.message || "Failed to join. Please try again.";
            console.error("Waitlist form error caught in catch block:", error);
            setError(errorMessage);
            toast.error("Submission Failed", {
                 description: errorMessage,
                 duration: 7000,
            });
        } finally {
            setIsSubmitting(false);
            console.log("Set isSubmitting = false in finally block");
        }
    };

    if (success) {
        return (
            <div className="text-center text-green-700 font-medium bg-green-50 p-4 rounded-md border border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700">
                Thanks for joining the waitlist! We'll be in touch.
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                 <div className="flex-grow">
                    <Label htmlFor="waitlist-email" className="sr-only">Email</Label>
                    <Input
                        id="waitlist-email"
                        type="email"
                        placeholder="Your Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isSubmitting}
                        className="bg-white dark:bg-black"
                        aria-describedby="waitlist-error"
                        aria-invalid={!!error}
                    />
                </div>
                <Button
                    type="submit"
                    className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 disabled:opacity-70 shrink-0"
                    disabled={isSubmitting || !email}
                >
                    {isSubmitting ? <LoadingIndicator /> : 'Join Waitlist'}
                </Button>
            </div>
            {error && <p id="waitlist-error" className="text-sm text-destructive text-center sm:text-left pt-1">{error}</p>}
        </form>
    );
}