// components/ActivityList.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { Activity } from '@/lib/types';
import { ActivityCard } from './ActivityCard'; // We'll create this next
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input"; // For potential search later
import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ActivityListProps {
    initialActivities: Activity[];
    ageRanges: string[];
    locations: string[];
    categories: string[];
}

export function ActivityList({
    initialActivities,
    ageRanges,
    locations,
    categories,
}: ActivityListProps) {
    const [selectedAgeRange, setSelectedAgeRange] = useState<string>('');
    const [selectedLocation, setSelectedLocation] = useState<string>('');
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    // const [searchTerm, setSearchTerm] = useState<string>(''); // For future search input

    const filteredActivities = useMemo(() => {
        return initialActivities.filter(activity => {
            const ageMatch = selectedAgeRange ? activity.ageRange === selectedAgeRange : true;
            const locationMatch = selectedLocation ? activity.location === selectedLocation : true;
            const categoryMatch = selectedCategory ? activity.category === selectedCategory : true;
            // const searchMatch = searchTerm ? activity.name.toLowerCase().includes(searchTerm.toLowerCase()) || activity.description.toLowerCase().includes(searchTerm.toLowerCase()) : true; // Future search

            return ageMatch && locationMatch && categoryMatch; // && searchMatch;
        });
    }, [initialActivities, selectedAgeRange, selectedLocation, selectedCategory]); // Add searchTerm later

    const clearFilters = () => {
        setSelectedAgeRange('');
        setSelectedLocation('');
        setSelectedCategory('');
        // setSearchTerm('');
    };

    const hasActiveFilters = selectedAgeRange || selectedLocation || selectedCategory; // || searchTerm;

    return (
        <div>
            {/* --- Filter Navigation --- */}
            <div className="mb-8 rounded-lg border bg-muted/50 p-4 shadow-sm">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                     <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <Filter className="h-4 w-4" />
                        Filter By:
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:flex md:flex-wrap md:gap-2">
                        {/* Age Range Filter */}
                        <Select value={selectedAgeRange} onValueChange={setSelectedAgeRange}>
                            <SelectTrigger className="h-9 w-full md:w-[160px] bg-white">
                                <SelectValue placeholder="Age Range" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="">All Ages</SelectItem>
                                {ageRanges.map(age => (
                                    <SelectItem key={age} value={age}>{age}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Location Filter */}
                         <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                            <SelectTrigger className="h-9 w-full md:w-[160px] bg-white">
                                <SelectValue placeholder="Location" />
                            </SelectTrigger>
                            <SelectContent>
                                 <SelectItem value="">All Locations</SelectItem>
                                {locations.map(loc => (
                                    <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                         {/* Category Filter */}
                         <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                            <SelectTrigger className="h-9 w-full md:w-[160px] bg-white">
                                <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                                 <SelectItem value="">All Categories</SelectItem>
                                {categories.map(cat => (
                                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Optional: Search Input */}
                        {/* <Input
                            type="search"
                            placeholder="Search activities..."
                            className="h-9 w-full md:w-[200px] bg-white"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        /> */}

                         {/* Clear Filters Button */}
                        {hasActiveFilters && (
                             <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground hover:text-foreground h-9">
                                <X className="mr-1 h-4 w-4" />
                                Clear
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* --- Activities Grid --- */}
            {filteredActivities.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredActivities.map((activity) => (
                        <ActivityCard key={activity.id} activity={activity} />
                    ))}
                </div>
            ) : (
                 <div className="text-center py-12 text-gray-500">
                    <p className="text-lg mb-2">No activities found matching your criteria.</p>
                    <p>Try adjusting your filters.</p>
                 </div>
            )}

             {/* Optional: Add pagination if list becomes long */}
        </div>
    );
}