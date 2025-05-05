'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import { EventClickArg, EventContentArg } from '@fullcalendar/core';

interface Activity {
    id: string;
    region: string;
    tool: string;
    location: string;
    start_time: string;
    end_time: string;
    participant_count: number;
    feedback?: string;
}

// 지역별 색상 매핑 (배경색, 테두리색, 글자색)
const regionColors: Record<string, { backgroundColor: string; borderColor: string; textColor: string }> = {
    도봉: { backgroundColor: '#bbdefb', borderColor: '#64b5f6', textColor: '#2196f3' }, // 파랑
    성북: { backgroundColor: '#f8bbd0', borderColor: '#f48fb1', textColor: '#e91e63' }, // 분홍
    노원: { backgroundColor: '#fff9c4', borderColor: '#fff176', textColor: '#fbc02d' }, // 노랑
    중랑: { backgroundColor: '#c8e6c9', borderColor: '#81c784', textColor: '#4caf50' }, // 초록
    강북: { backgroundColor: '#e1bee7', borderColor: '#ce93d8', textColor: '#9c27b0' }, // 보라
    대학: { backgroundColor: '#ffe0b2', borderColor: '#ffcc80', textColor: '#ff9800' }, // 주황
    새신자: { backgroundColor: '#b2dfdb', borderColor: '#80cbc4', textColor: '#009688' }, // 유지
};

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
        router.push(`/schedule/${arg.dateStr}`);
    };

    const handleEventClick = (arg: EventClickArg) => {
        router.push(`/activities/${arg.event.id}`);
    };

    const formatTime = (dateStr: string) => {
        const date = new Date(dateStr);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    return (
        <div className="calendar-container">
            {/* FullCalendar 스타일 커스터마이징 */}
            <style jsx global>{`
                .fc .fc-daygrid-event {
                    white-space: normal !important;
                    overflow-wrap: break-word;
                    word-break: break-word;
                    font-weight: bold;
                }
            `}</style>

            <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridWeek"
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridWeek,dayGridMonth',
                }}
                buttonText={{
                    today: '오늘',
                    month: '월간',
                    week: '주간',
                }}
                dateClick={handleDateClick}
                eventClick={handleEventClick}
                events={activities.map((activity) => {
                    const colors = regionColors[activity.region] || {
                        backgroundColor: '#e0e0e0',
                        borderColor: '#9e9e9e',
                        textColor: '#000000',
                    };

                    const feedbackIndicator = activity.feedback ? '🟦' : '🟥';
                    const time = formatTime(activity.start_time);
                    const title = `${time} ${activity.region} ${activity.location} ${activity.tool} ${feedbackIndicator}`;

                    return {
                        id: activity.id,
                        title,
                        start: activity.start_time,
                        end: activity.end_time,
                        allDay: false,
                        backgroundColor: colors.backgroundColor,
                        borderColor: colors.borderColor,
                        extendedProps: {
                            textColor: colors.textColor,
                        },
                    };
                })}
                eventContent={(eventInfo: EventContentArg) => {
                    const textColor = eventInfo.event.extendedProps.textColor || '#000';
                    return <div style={{ color: textColor }}>{eventInfo.event.title}</div>;
                }}
            />
        </div>
    );
}
