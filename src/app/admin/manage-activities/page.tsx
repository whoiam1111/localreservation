'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/app/lib/supabase';

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
    result?: { lead: string; name: string; team: string; type: string; phone: string }[];
}

interface GroupedActivities {
    [region: string]: {
        [date: string]: Activity[];
    };
}

export default function ManageActivities() {
    const [groupedActivities, setGroupedActivities] = useState<GroupedActivities>({});
    const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    const groupActivitiesByRegionAndDate = useCallback((activities: Activity[]) => {
        const grouped = activities.reduce((acc: GroupedActivities, activity: Activity) => {
            const { region, date } = activity;
            if (!acc[region]) acc[region] = {};
            if (!acc[region][date]) acc[region][date] = [];
            acc[region][date].push(activity);
            return acc;
        }, {});
        setGroupedActivities(grouped);
    }, []);

    useEffect(() => {
        const fetchActivities = async () => {
            const { data, error } = await supabase.from('activities').select('*').order('date', { ascending: true });
            if (data) {
                groupActivitiesByRegionAndDate(data as Activity[]);
            } else {
                console.error('Error fetching activities:', error);
            }
        };
        fetchActivities();
    }, [groupActivitiesByRegionAndDate]);

    const handleRegionClick = (region: string) => {
        setSelectedRegion(region);
        setSelectedDate(null);
    };

    const handleDateClick = (date: string) => {
        setSelectedDate(date);
    };

    return (
        <div className="p-4">
            <h1 className="text-3xl font-bold mb-6">활동 관리</h1>

            {/* 지역 선택 탭 */}
            <div className="flex flex-wrap gap-3 mb-6">
                {Object.keys(groupedActivities).map((region) => (
                    <button
                        key={region}
                        onClick={() => handleRegionClick(region)}
                        className={`px-4 py-2 rounded-xl transition ${
                            selectedRegion === region ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'
                        }`}
                    >
                        {region}
                    </button>
                ))}
            </div>

            {selectedRegion && (
                <div>
                    <h2 className="text-2xl font-semibold mb-3">{selectedRegion} 활동</h2>
                    {Object.keys(groupedActivities[selectedRegion]).map((date) => (
                        <div
                            key={date}
                            className="mb-4"
                        >
                            <button
                                onClick={() => handleDateClick(date)}
                                className={`block w-full text-left px-4 py-2 rounded-lg font-medium ${
                                    selectedDate === date ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-800'
                                }`}
                            >
                                {date}
                            </button>

                            {selectedDate === date && (
                                <div className="mt-2 pl-4 space-y-4">
                                    {groupedActivities[selectedRegion][date].map((activity) => (
                                        <div
                                            key={activity.id}
                                            className="p-4 bg-white rounded-xl shadow-sm border"
                                        >
                                            <p className="font-semibold text-lg">{activity.title}</p>
                                            <p className="text-sm text-gray-700">{activity.description}</p>
                                            <p className="text-sm text-gray-500">
                                                🕒 {activity.start_time} ~ {activity.end_time}
                                            </p>
                                            <p className="text-sm text-gray-500">📍 {activity.location}</p>
                                            <p className="text-sm text-gray-500">
                                                👥 참여자 수: {activity.participant_count}
                                            </p>
                                            {/* result가 객체 배열일 경우 표로 처리 */}
                                            {activity.result && activity.result.length > 0 && (
                                                <div className="mt-4">
                                                    <p className="font-semibold text-lg">📊 결과:</p>
                                                    <table className="min-w-full table-auto border-collapse border border-gray-300 mt-2">
                                                        <thead>
                                                            <tr>
                                                                <th className="px-4 py-2 text-left border-b">섭외자</th>

                                                                <th className="px-4 py-2 text-left border-b">인도자</th>
                                                                <th className="px-4 py-2 text-left border-b">팀</th>
                                                                <th className="px-4 py-2 text-left border-b">Type</th>
                                                                <th className="px-4 py-2 text-left border-b">Phone</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {activity.result.map((res, index) => (
                                                                <tr
                                                                    key={index}
                                                                    className="border-b"
                                                                >
                                                                    <td className="px-4 py-2">{res.name}</td>
                                                                    <td className="px-4 py-2">{res.lead}</td>
                                                                    <td className="px-4 py-2">{res.team}</td>
                                                                    <td className="px-4 py-2">{res.type}</td>
                                                                    <td className="px-4 py-2">{res.phone}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
