'use client';

import { useEffect, useState } from 'react';
import { notFound, useParams } from 'next/navigation';
import Link from 'next/link';
import type { Activity } from '@/app/lib/type';
export default function SchedulePage() {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [filteredActivities, setFilteredActivities] = useState<Activity[]>([]);
    const params = useParams();
    const date = params.date as string;

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const res = await fetch('/api/activities', {
                    cache: 'no-store',
                });
                const data = await res.json();
                if (data.activities) {
                    setActivities(data.activities);
                } else {
                    console.error('활동 데이터가 없습니다.');
                    notFound();
                }
            } catch (err) {
                console.error('활동 데이터를 불러오는데 실패했습니다:', err);
                notFound();
            }
        };

        fetchActivities();
    }, []);

    useEffect(() => {
        if (date && activities.length > 0) {
            const filtered = activities.filter((a: Activity) => a.date === date);
            setFilteredActivities(filtered);
        }
    }, [activities, date]);

    if (!date) return <p className="text-center py-6 text-gray-500">날짜를 확인 중입니다...</p>;
    if (filteredActivities.length === 0)
        return <p className="text-center py-6 text-gray-500">등록된 활동이 없습니다.</p>;

    return (
        <main className="max-w-3xl mx-auto px-4 py-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-center text-blue-700 mb-8">📅 {date} 활동 목록</h1>

            <ul className="space-y-6">
                {filteredActivities.map((a) => (
                    <li key={a.id}>
                        <Link
                            href={`/activities/${a.id}`}
                            className="block bg-white rounded-2xl shadow-md p-5 hover:shadow-lg transition hover:bg-gray-50"
                        >
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                                <h2 className="text-lg font-semibold text-gray-800">🛠️ {a.tool}</h2>
                                <span className="text-sm text-gray-500">👥 {a.participant_count}명 참여</span>
                            </div>

                            <p className="mt-2 text-gray-600">
                                📍 {a.location} ({a.region})
                            </p>

                            <div className="mt-2 text-sm text-gray-700">
                                ⏰ {a.start_time} ~ {a.end_time}
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
        </main>
    );
}
