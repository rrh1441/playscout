// app/page.tsx
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Calendar, Filter, MapPin, MessageSquare, Search, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Sample data (remains the same)
const activities = [
 {
    id: 1,
    name: "Kids Soccer Club",
    ageRange: "4-6 years",
    city: "Portland",
    category: "Sports",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 2,
    name: "Art & Craft Workshop",
    ageRange: "7-10 years",
    city: "Seattle",
    category: "Arts",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 3,
    name: "Junior Coding Camp",
    ageRange: "8-12 years",
    city: "Portland",
    category: "STEM",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 4,
    name: "Ballet Classes",
    ageRange: "5-8 years",
    city: "Vancouver",
    category: "Dance",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 5,
    name: "Swimming Lessons",
    ageRange: "3-6 years",
    city: "Portland",
    category: "Sports",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 6,
    name: "Music for Toddlers",
    ageRange: "2-4 years",
    city: "Seattle",
    category: "Music",
    image: "/placeholder.svg?height=200&width=300",
  },
]

export default function LandingPage() {
  return (
    // Removed outer div and header/footer
    // The main tag now directly contains the page content
    // The flex-1 class is now handled in the RootLayout's main tag
     <>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-orange-50 to-white px-4 py-10 md:py-14">
        <div className="container mx-auto">
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div className="text-center md:text-left">
              <h1 className="mb-3 text-3xl font-bold leading-tight tracking-tighter md:text-4xl lg:text-5xl">
                Find the perfect activity for your kid—fast
              </h1>
              <p className="mb-5 text-lg text-gray-600">
                Discover and register for the best local activities, classes, and camps for children of all ages
              </p>
              <Link href="/activities"> {/* Changed from anchor to Link */}
                <Button size="lg" className="bg-orange-500 px-8 hover:bg-orange-600">
                  Browse Activities
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="order-first md:order-last">
              <div className="relative mx-auto overflow-hidden rounded-lg shadow-lg">
                <Image
                  src="/images/playscouthero.png" // Ensure this image exists or replace
                  alt="Children playing soccer in a park"
                  width={600}
                  height={400}
                  className="h-auto w-full object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Activities Section */}
      <section id="activities" className="px-4 py-10 md:py-12">
        <div className="container mx-auto">
          <h2 className="mb-4 text-center text-2xl font-bold md:text-3xl">Featured Activities</h2>

          {/* Filter Navigation */}
          <div className="mb-8 rounded-lg bg-gray-50 p-4">
            <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
              <div className="flex items-center">
                <Filter className="mr-2 h-5 w-5 text-gray-500" />
                <span className="font-medium">Filter By:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <Select>
                  <SelectTrigger className="h-9 w-[140px]">
                    <SelectValue placeholder="Age Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-3">0-3 years</SelectItem>
                    <SelectItem value="4-6">4-6 years</SelectItem>
                    <SelectItem value="7-10">7-10 years</SelectItem>
                    <SelectItem value="11-14">11-14 years</SelectItem>
                  </SelectContent>
                </Select>

                <Select>
                  <SelectTrigger className="h-9 w-[140px]">
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="portland">Portland</SelectItem>
                    <SelectItem value="seattle">Seattle</SelectItem>
                    <SelectItem value="vancouver">Vancouver</SelectItem>
                  </SelectContent>
                </Select>

                <Select>
                  <SelectTrigger className="h-9 w-[140px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sports">Sports</SelectItem>
                    <SelectItem value="arts">Arts</SelectItem>
                    <SelectItem value="stem">STEM</SelectItem>
                    <SelectItem value="music">Music</SelectItem>
                    <SelectItem value="dance">Dance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Activities Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {activities.map((activity) => (
              <Card key={activity.id} className="overflow-hidden">
                <img
                  src={activity.image || "/placeholder.svg"}
                  alt={activity.name}
                  className="h-40 w-full object-cover"
                />
                <CardContent className="p-4">
                  <h3 className="mb-2 text-lg font-semibold">{activity.name}</h3>
                  <div className="mb-1 flex items-center text-sm text-gray-600">
                    <Users className="mr-1 h-4 w-4" />
                    {activity.ageRange}
                  </div>
                  <div className="mb-1 flex items-center text-sm text-gray-600">
                    <MapPin className="mr-1 h-4 w-4" />
                    {activity.city}
                  </div>
                  <div className="flex items-center">
                    {/* Simple badge - replace if using ActivityCard component */}
                     <span className={`rounded-full px-2 py-1 text-xs font-medium ${activity.category === 'Sports' ? 'bg-blue-100 text-blue-800' : activity.category === 'Arts' ? 'bg-purple-100 text-purple-800' : activity.category === 'STEM' ? 'bg-green-100 text-green-800' : activity.category === 'Dance' ? 'bg-pink-100 text-pink-800' : activity.category === 'Music' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                        {activity.category}
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="border-t bg-gray-50 p-4">
                  {/* Link should go to the actual activity page if using dynamic data */}
                  <Link href={`/activities/${activity.id}`} className="w-full">
                     <Button variant="outline" className="w-full border-orange-500 text-orange-500 hover:bg-orange-50">
                        View Details
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="mt-8 text-center">
             <Link href="/activities">
                <Button className="bg-orange-500 hover:bg-orange-600">View All Activities</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="bg-gray-50 px-4 py-10 md:py-12">
        <div className="container mx-auto max-w-5xl">
          <h2 className="mb-6 text-center text-2xl font-bold md:text-3xl">How it works</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-lg bg-white p-6 text-center shadow-md">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-orange-500">
                <Search className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">Search</h3>
              <p className="text-gray-600">Browse activities by age, location, or category</p>
            </div>
            <div className="rounded-lg bg-white p-6 text-center shadow-md">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-500">
                <Calendar className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">Choose</h3>
              <p className="text-gray-600">Find the perfect fit for your child's interests</p>
            </div>
            <div className="rounded-lg bg-white p-6 text-center shadow-md">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-orange-500">
                <MapPin className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">Register</h3>
              <p className="text-gray-600">Sign up directly with the activity provider</p>
            </div>
          </div>
        </div>
      </section>

      {/* Submit Activity Section */}
      <section id="submit" className="px-4 py-10 md:py-12">
        <div className="container mx-auto max-w-4xl">
          <h2 className="mb-4 text-center text-2xl font-bold md:text-3xl">Submit Your Activity</h2>
            <p className="mb-6 text-center text-gray-600">Have an activity to list? Let us know!</p>
          <div className="rounded-lg border shadow-md p-6 text-center">
             <p className="mb-4">Use the button below to go to the submission page.</p>
            <Link href="/submit">
              <Button className="bg-green-500 hover:bg-green-600">Go to Submission Form</Button>
             </Link>
            {/* Removed iframe as it's on a separate page now */}
          </div>
        </div>
      </section>

      {/* Waitlist Section - Kept as example, might remove if not needed */}
      <section id="waitlist" className="bg-orange-50 px-4 py-10 md:py-12">
        <div className="container mx-auto max-w-md text-center">
          <h2 className="mb-2 text-2xl font-bold md:text-3xl">Join our waitlist</h2>
          <p className="mb-4 text-gray-600">
            PlayScout is growing! Be the first to know about new features and locations.
          </p>
          <form className="mb-6 flex flex-col space-y-4 sm:flex-row sm:space-x-2 sm:space-y-0">
            <Input type="email" placeholder="Enter your email" className="flex-1 rounded-md border-gray-300 bg-white" />
            <Button className="bg-orange-500 hover:bg-orange-600">Join Waitlist</Button>
          </form>
          <div className="flex justify-center">
             <Link href="/contact"> {/* Changed from anchor to Link */}
              <Button variant="outline" className="border-orange-500 text-orange-500 hover:bg-orange-50">
                <MessageSquare className="mr-2 h-4 w-4" />
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section - Simplified, full contact on /contact page */}
      <section id="contact" className="px-4 py-10 md:py-12">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="mb-4 text-2xl font-bold md:text-3xl">Contact Us</h2>
          <p className="mb-6 text-gray-600">Have questions? We're here to help!</p>
          <Link href="/contact">
             <Button className="bg-orange-500 hover:bg-orange-600">
                Go to Contact Page
             </Button>
          </Link>
        </div>
      </section>
    </> // Use Fragment as the main tag is in layout
  )
}