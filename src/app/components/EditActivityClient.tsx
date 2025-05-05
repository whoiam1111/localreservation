'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/app/lib/supabase';

type Activity = {
    id: string;
    region: string;
    location: string;
    start_time: string;
    participant_count: number;
    end_time: string;
    tool: string;
    date: string;
};

const REGION_OPTIONS = ['도봉', '성북', '노원', '중랑', '강북', '대학', '새신자'];

export default function EditActivityClient({ activityId }: { activityId: string }) {
    const [activity, setActivity] = useState<Activity | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchActivity = async () => {
            const { data, error } = await supabase.from('activities').select('*').eq('id', activityId).single();

            if (error || !data) {
                console.error('Error fetching activity:', error);
                router.push('/404');
            } else {
                setActivity(data);
            }
        };

        fetchActivity();
    }, [activityId, router]);

    if (!activity) {
        return <p>Loading...</p>;
    }

    const handleSubmit = async (formData: FormData) => {
        const date = formData.get('date') as string;
        const startTime = formData.get('startTime') as string;
        const endTime = formData.get('endTime') as string;

        const updated = {
            location: formData.get('location'),
            start_time: `${date}T${startTime}`,
            end_time: `${date}T${endTime}`,
            tool: formData.get('tool'),
            region: formData.get('region'),
            date,
        };

        const { error } = await supabase.from('activities').update(updated).eq('id', activityId);

        if (error) {
            console.error('활동 수정 실패:', error.message);
            return;
        }

        router.push(`/activities/${activityId}`);
    };

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                handleSubmit(formData);
            }}
            className="p-4 space-y-4 bg-white min-h-screen"
        >
            <h1 className="text-xl font-bold mb-4">활동 수정</h1>

            <label className="block">
                날짜
                <input
                    name="date"
                    type="date"
                    defaultValue={activity.date}
                    className="w-full border p-2 rounded"
                    required
                />
            </label>

            <label className="block">
                장소
                <input
                    name="location"
                    defaultValue={activity.location}
                    className="w-full border p-2 rounded"
                    required
                />
            </label>

            <div className="flex gap-2">
                <label className="flex-1">
                    시작 시간
                    <input
                        name="startTime"
                        type="time"
                        defaultValue={activity.start_time.slice(11, 16)}
                        className="w-full border p-2 rounded"
                        required
                    />
                </label>

                <label className="flex-1">
                    종료 시간
                    <input
                        name="endTime"
                        type="time"
                        defaultValue={activity.end_time.slice(11, 16)}
                        className="w-full border p-2 rounded"
                        required
                    />
                </label>
            </div>

            <label className="block">
                도구
                <input name="tool" defaultValue={activity.tool} className="w-full border p-2 rounded" required />
            </label>

            <label className="block">
                지역
                <select name="region" defaultValue={activity.region} className="w-full border p-2 rounded" required>
                    {REGION_OPTIONS.map((region) => (
                        <option key={region} value={region}>
                            {region}
                        </option>
                    ))}
                </select>
            </label>

            <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
                저장하기
            </button>
        </form>
    );
}
