'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction'; // 수정된 부분
import './CustomCalendar.css';

interface Activity {
    id: string;
    tool: string;
    location: string;
    start_time: string;
    end_time: string;
}

export default function CustomCalendar() {
    const [activities, setActivities] = useState<Activity[]>([]);
    const router = useRouter();

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const res = await fetch('/api/activities');
                const data = await res.json();
                setActivities(data.activities || []);
            } catch (err) {
                console.error('활동 데이터를 불러오는데 실패했습니다:', err);
            }
        };
        fetchActivities();
    }, []);

    const handleDateClick = (arg: DateClickArg) => {
        const clickedDate = arg.dateStr; // yyyy-MM-dd
        router.push(`/schedule/${clickedDate}`);
    };

    return (
        <div className="calendar-container">
            <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]} // interactionPlugin 추가
                initialView="dayGridMonth"
                dateClick={handleDateClick} // 날짜 클릭 핸들러
                events={activities.map((activity) => ({
                    title: `${activity.tool} @ ${activity.location}`,
                    start: activity.start_time,
                    end: activity.end_time,
                    allDay: false,
                    backgroundColor: '#81d4fa',
                    borderColor: '#0288d1',
                    textColor: '#000',
                }))}
            />
        </div>
    );
}
