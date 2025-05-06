'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import { EventClickArg, EventContentArg } from '@fullcalendar/core';
import Loading from './Loading';

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

// 지역별 색상 매핑
const regionColors: Record<string, { backgroundColor: string; borderColor: string }> = {
    도봉: { backgroundColor: '#90caf9', borderColor: '#1e88e5' },
    성북: { backgroundColor: '#f48fb1', borderColor: '#d81b60' },
    노원: { backgroundColor: '#fff176', borderColor: '#fbc02d' },
    중랑: { backgroundColor: '#a5d6a7', borderColor: '#388e3c' },
    강북: { backgroundColor: '#ce93d8', borderColor: '#8e24aa' },
    대학: { backgroundColor: '#ffb74d', borderColor: '#ef6c00' },
    새신자: { backgroundColor: '#80cbc4', borderColor: '#00897b' },
};

export default function CustomCalendar() {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가
    const router = useRouter();
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const res = await fetch('/api/activities');
                const data = await res.json();
                setActivities(data.activities || []);
            } catch (err) {
                console.error('활동 데이터를 불러오는데 실패했습니다:', err);
            } finally {
                setIsLoading(false); // 로딩 완료 후 상태 변경
            }
        };
        fetchActivities();

        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => {
            window.removeEventListener('resize', handleResize);
        };
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

    if (isLoading) {
        return <Loading />; // Use the Loading component when loading
    }

    return (
        <div className="calendar-container">
            <style jsx global>{`
                .fc .fc-daygrid-event {
                    white-space: normal !important;
                    overflow-wrap: break-word;
                    word-break: break-word;
                    font-weight: bold;
                }

                /* 모바일에서 캘린더 스타일 조정 */
                @media (max-width: 768px) {
                    .fc .fc-daygrid-event {
                        font-size: 0.75rem;
                        padding: 2px 4px;
                        border-radius: 4px;
                    }
                    .fc .fc-daygrid-day {
                        height: 80px !important; /* 높이를 줄여서 일정 항목을 보기 쉽게 */
                    }
                }
            `}</style>

            <FullCalendar
                height="auto"
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView={isMobile ? 'dayGridDay' : 'dayGridWeek'}
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: isMobile ? 'dayGridDay,dayGridWeek,dayGridMonth' : 'dayGridWeek,dayGridMonth',
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
                    };
                })}
                eventContent={(eventInfo: EventContentArg) => {
                    return (
                        <div
                            style={{
                                backgroundColor: eventInfo.backgroundColor || '#e0e0e0',
                                padding: '4px 6px',
                                borderRadius: '6px',
                                color: '#000',
                                fontWeight: 'bold',
                                fontSize: '0.85rem',
                                lineHeight: '1.2',
                                whiteSpace: 'normal',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                            }}
                        >
                            {eventInfo.event.title}
                        </div>
                    );
                }}
            />
        </div>
    );
}
