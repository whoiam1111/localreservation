'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// Define types for the activity and grouped activities
interface Activity {
    id: string;
    region: string;
    date: string;
    title: string;
    description: string;
    start_time: string;
    end_time: string;
    location: string;
    participant_count: number;
    result: string;
}

interface GroupedActivities {
    [region: string]: {
        [date: string]: Activity[];
    };
}

export default function ManageActivities() {
    const supabase = createClientComponentClient();

    const [groupedActivities, setGroupedActivities] = useState<GroupedActivities>({});
    const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    useEffect(() => {
        const fetchActivities = async () => {
            const { data, error } = await supabase.from('activities').select('*').order('date', { ascending: true });

            if (data) {
                groupActivitiesByRegionAndDate(data);
            } else if (error) {
                console.error('Error fetching activities:', error);
            }
        };

        fetchActivities();
    }, [supabase]); // Add supabase to the dependencies

    // Group activities by region and date
    const groupActivitiesByRegionAndDate = (activities: Activity[]) => {
        const grouped = activities.reduce((acc: GroupedActivities, activity: Activity) => {
            const { region, date } = activity;

            if (!acc[region]) acc[region] = {};
            if (!acc[region][date]) acc[region][date] = [];

            acc[region][date].push(activity);

            return acc;
        }, {});

        setGroupedActivities(grouped);
    };

    const handleRegionClick = (region: string) => {
        setSelectedRegion(region);
        setSelectedDate(null); // Reset date when region changes
    };

    const handleDateClick = (date: string) => {
        setSelectedDate(date);
    };

    return (
        <div className="p-4">
            <h1 className="text-3xl font-bold mb-4">활동 관리</h1>

            {/* Region tabs */}
            <div className="mb-4 flex space-x-4">
                {Object.keys(groupedActivities).map((region) => (
                    <button
                        key={region}
                        onClick={() => handleRegionClick(region)}
                        className={`px-4 py-2 rounded ${
                            selectedRegion === region ? 'bg-blue-500 text-white' : 'bg-gray-200'
                        }`}
                    >
                        {region}
                    </button>
                ))}
            </div>

            {/* Display activities for the selected region */}
            {selectedRegion && (
                <div className="mt-4">
                    <h2 className="text-2xl font-semibold mb-2">{selectedRegion} 활동</h2>

                    {/* Display activities by date */}
                    {Object.keys(groupedActivities[selectedRegion]).map((date) => (
                        <div key={date}>
                            <button
                                onClick={() => handleDateClick(date)}
                                className={`block w-full text-left p-2 mb-2 rounded ${
                                    selectedDate === date ? 'bg-green-500 text-white' : 'bg-gray-300'
                                }`}
                            >
                                {date}
                            </button>

                            {/* Display details of activities for the selected date */}
                            {selectedDate === date && (
                                <div className="pl-4">
                                    <ul className="list-disc">
                                        {groupedActivities[selectedRegion][date].map((activity, index) => (
                                            <li key={index} className="mb-2">
                                                <p className="font-semibold">{activity.title}</p>
                                                <p>{activity.description}</p>
                                                <p className="text-sm text-gray-500">
                                                    {activity.start_time} ~ {activity.end_time} at {activity.location}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    참여자 수: {activity.participant_count}
                                                </p>
                                                <p className="text-sm text-gray-500">{activity.result}</p>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
