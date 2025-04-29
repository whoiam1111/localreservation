'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Activity {
    id: string;
    location: string;
    startTime: string;
    endTime: string;
    tool: string;
    result?: string;
    feedback?: string;
    createdAt: string;
}

export default function ActivityList() {
    const [activities, setActivities] = useState<Activity[]>([]);

    useEffect(() => {
        const fetchActivities = async () => {
            const res = await fetch('/api/activities');
            const data = await res.json();
            setActivities(data.activities || []);
        };

        fetchActivities();
    }, []);

    if (activities.length === 0) {
        return <p className="text-sm text-gray-500 mt-4">등록된 활동이 없습니다.</p>;
    }

    return (
        <ul className="mt-4 space-y-2">
            {activities.map((a) => (
                <li key={a.id} className="p-3 border rounded shadow-sm bg-gray-50 text-sm hover:bg-gray-100 transition">
                    <Link href={`/activities/${a.id}`}>
                        <p>
                            📍 <b>{a.location}</b>
                        </p>
                        <p>
                            ⏰ {a.startTime} - {a.endTime}
                        </p>
                        <p>🛠️ {a.tool}</p>
                    </Link>
                </li>
            ))}
        </ul>
    );
}
