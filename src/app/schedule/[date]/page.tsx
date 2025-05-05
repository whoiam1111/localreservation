'use client';

import { useEffect, useState } from 'react';
import { notFound, useParams } from 'next/navigation';

interface Activity {
    id: string;
    region: string;
    tool: string;
    location: string;
    start_time: string;
    end_time: string;
    participant_count: number;
}

export default function SchedulePage() {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [filteredActivities, setFilteredActivities] = useState<Activity[]>([]);
    const params = useParams();
    const date = params.date as string; // 경로가 /schedule/[date]여야 합니다

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
            const filtered = activities.filter((a: Activity) => a.start_time.startsWith(date));
            setFilteredActivities(filtered);
        }
    }, [activities, date]);

    if (!date) return <p>날짜를 확인 중입니다...</p>;
    if (filteredActivities.length === 0) return <p>등록된 활동이 없습니다.</p>;

    return (
        <div>
            <h1>{date} 활동 목록</h1>
            <ul>
                {filteredActivities.map((a) => (
                    <li key={a.id}>
                        <strong>{a.tool}</strong> @ {a.location}
                        <br />
                        {a.start_time} ~ {a.end_time}
                    </li>
                ))}
            </ul>
        </div>
    );
}
