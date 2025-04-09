import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Calendar, Filter, MapPin, MessageSquare, Search, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Sample data
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
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 bg-white px-4 py-4 shadow-sm">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold text-orange-500">PlayScout</span>
          </Link>
          <nav className="hidden space-x-6 md:flex">
            <a href="#activities" className="text-sm font-medium hover:text-orange-500">
              Activities
            </a>
            <a href="#how-it-works" className="text-sm font-medium hover:text-orange-500">
              How It Works
            </a>
            <a href="#submit" className="text-sm font-medium hover:text-orange-500">
              Submit Activity
            </a>
            <a href="#contact" className="text-sm font-medium hover:text-orange-500">
              Contact
            </a>
          </nav>
          <Button variant="ghost" size="icon" className="md:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </Button>
        </div>
      </header>
      <main className="flex-1">
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
                <a href="#activities">
                  <Button size="lg" className="bg-orange-500 px-8 hover:bg-orange-600">
                    Browse Activities
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </a>
              </div>
              <div className="order-first md:order-last">
                <div className="relative mx-auto overflow-hidden rounded-lg shadow-lg">
                  <Image
                    src="/images/playscouthero.png"
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
                      <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                        {activity.category}
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t bg-gray-50 p-4">
                    <Button variant="outline" className="w-full border-orange-500 text-orange-500 hover:bg-orange-50">
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Button className="bg-orange-500 hover:bg-orange-600">View All Activities</Button>
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
            <div className="rounded-lg border shadow-md">
              <iframe
                src="https://tally.so/embed/example-form"
                width="100%"
                height="500"
                frameBorder="0"
                marginHeight={0}
                marginWidth={0}
                title="Submit Activity Form"
                className="rounded-lg"
              ></iframe>
            </div>
          </div>
        </section>

        {/* Waitlist Section */}
        <section id="waitlist" className="bg-orange-50 px-4 py-10 md:py-12">
          <div className="container mx-auto max-w-md text-center">
            <h2 className="mb-2 text-2xl font-bold md:text-3xl">Join our waitlist</h2>
            <p className="mb-4 text-gray-600">
              PlayScout is coming soon! Be the first to know when we launch in your area.
            </p>
            <form className="mb-6 flex flex-col space-y-4 sm:flex-row sm:space-x-2 sm:space-y-0">
              <Input type="email" placeholder="Enter your email" className="flex-1 rounded-md border-gray-300" />
              <Button className="bg-orange-500 hover:bg-orange-600">Join Waitlist</Button>
            </form>
            <div className="flex justify-center">
              <a href="#contact">
                <Button variant="outline" className="border-orange-500 text-orange-500 hover:bg-orange-50">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Contact Us
                </Button>
              </a>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="px-4 py-10 md:py-12">
          <div className="container mx-auto max-w-2xl">
            <h2 className="mb-4 text-center text-2xl font-bold md:text-3xl">Contact Us</h2>

            <div className="mb-5 rounded-lg bg-green-50 p-4 text-center">
              <p className="text-gray-700">
                Have questions about activities or need help finding the perfect fit for your child? We're here to help!
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-start">
                  <MessageSquare className="mr-3 h-5 w-5 text-orange-500" />
                  <div>
                    <h3 className="font-medium">Email Us</h3>
                    <p className="text-sm text-gray-600">hello@playscout.example</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Calendar className="mr-3 h-5 w-5 text-orange-500" />
                  <div>
                    <h3 className="font-medium">Response Time</h3>
                    <p className="text-sm text-gray-600">We typically respond within 24 hours</p>
                  </div>
                </div>
              </div>

              <form className="space-y-4">
                <div>
                  <label htmlFor="name" className="mb-1 block text-sm font-medium">
                    Name
                  </label>
                  <Input id="name" name="name" placeholder="Your name" required />
                </div>
                <div>
                  <label htmlFor="email" className="mb-1 block text-sm font-medium">
                    Email
                  </label>
                  <Input id="email" name="email" type="email" placeholder="Your email" required />
                </div>
                <div>
                  <label htmlFor="message" className="mb-1 block text-sm font-medium">
                    Message
                  </label>
                  <Textarea id="message" name="message" placeholder="How can we help you?" rows={4} required />
                </div>
                <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600">
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-gray-50 px-4 py-8">
        <div className="container mx-auto">
          <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
            <div className="text-sm text-gray-600">© {new Date().getFullYear()} PlayScout. All rights reserved.</div>
            <div className="flex space-x-6">
              <a href="#activities" className="text-sm text-gray-600 hover:text-orange-500">
                Activities
              </a>
              <a href="#how-it-works" className="text-sm text-gray-600 hover:text-orange-500">
                How It Works
              </a>
              <a href="#submit" className="text-sm text-gray-600 hover:text-orange-500">
                Submit
              </a>
              <a href="#contact" className="text-sm text-gray-600 hover:text-orange-500">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
