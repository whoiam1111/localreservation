'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/app/lib/supabase';

type Activity = {
    id: string;
    location: string;
    start_time: string;
    end_time: string;
    tool: string;
};

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
        const updated = {
            location: formData.get('location'),
            start_time: formData.get('startTime'),
            end_time: formData.get('endTime'),
            tool: formData.get('tool'),
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

            <input name="location" defaultValue={activity.location} className="w-full border p-2 rounded" required />
            <input
                name="startTime"
                type="time"
                defaultValue={activity.start_time.slice(11, 16)}
                className="w-full border p-2 rounded"
                required
            />
            <input
                name="endTime"
                type="time"
                defaultValue={activity.end_time.slice(11, 16)}
                className="w-full border p-2 rounded"
                required
            />
            <input name="tool" defaultValue={activity.tool} className="w-full border p-2 rounded" required />

            <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
                저장하기
            </button>
        </form>
    );
}
