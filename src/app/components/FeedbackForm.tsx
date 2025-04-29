'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function FeedbackForm({ activityId }: { activityId: string }) {
    const [result, setResult] = useState('');
    const [feedback, setFeedback] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        await fetch(`/api/activities/${activityId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ result, feedback }),
        });

        router.push('/');
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium">활동 결과</label>
                <textarea
                    value={result}
                    onChange={(e) => setResult(e.target.value)}
                    className="w-full border p-2 rounded"
                    rows={3}
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium">피드백</label>
                <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    className="w-full border p-2 rounded"
                    rows={3}
                    required
                />
            </div>

            <button type="submit" className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600">
                제출하기
            </button>
        </form>
    );
}
