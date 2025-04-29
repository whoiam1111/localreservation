'use client';

import { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';

interface Activity {
    id: string;
    tool: string;
    location: string;
    start_time: string;
    end_time: string;
}

export default function SchedulePage({ params }: { params: Promise<{ date: string }> }) {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [filteredActivities, setFilteredActivities] = useState<Activity[]>([]);
    const [date, setDate] = useState<string | null>(null);

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
                    notFound(); // 데이터가 없으면 404 페이지로 이동
                }
            } catch (err) {
                console.error('활동 데이터를 불러오는데 실패했습니다:', err);
                notFound(); // 에러 발생 시 404 페이지로 이동
            }
        };

        fetchActivities();
    }, []);

    useEffect(() => {
        // params.date가 Promise이므로, 이를 처리하는 부분
        const getParams = async () => {
            const resolvedParams = await params;
            setDate(resolvedParams.date);
        };

        getParams();
    }, [params]);

    useEffect(() => {
        if (date && activities.length > 0) {
            // date가 설정된 후 activities 필터링
            const filtered = activities.filter((a: Activity) => a.start_time.startsWith(date));
            setFilteredActivities(filtered);
        }
    }, [activities, date]);

    if (!date) return <p>Loading...</p>; // date 값이 아직 없으면 Loading 상태 표시

    if (filteredActivities.length === 0) {
        return <p>등록된 활동이 없습니다.</p>;
    }

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
