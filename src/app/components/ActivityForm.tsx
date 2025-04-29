'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ActivityForm() {
    const router = useRouter();
    const [location, setLocation] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [tool, setTool] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const today = new Date().toISOString().split('T')[0]; // 'YYYY-MM-DD'

        const newActivity = {
            location,
            startTime: `${today}T${startTime}`,
            endTime: `${today}T${endTime}`,
            tool,
        };

        await fetch('/api/activities', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newActivity),
        });

        router.push('/');
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium">장소</label>
                <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full border p-2 rounded"
                    required
                />
            </div>

            <div className="flex gap-2">
                <div className="flex-1">
                    <label className="block text-sm font-medium">시작 시간</label>
                    <input
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="w-full border p-2 rounded"
                        required
                    />
                </div>
                <div className="flex-1">
                    <label className="block text-sm font-medium">종료 시간</label>
                    <input
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        className="w-full border p-2 rounded"
                        required
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium">도구</label>
                <input
                    type="text"
                    value={tool}
                    onChange={(e) => setTool(e.target.value)}
                    className="w-full border p-2 rounded"
                    required
                />
            </div>

            <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
                저장하기
            </button>
        </form>
    );
}
