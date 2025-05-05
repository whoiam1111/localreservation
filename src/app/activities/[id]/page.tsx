'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

interface Activity {
    id: string;
    location: string;
    start_time: string;
    end_time: string;
    tool: string;
    result?: string;
    feedback?: string;
    created_at: string;
    region: string;
    participant_count: number;
}

export default function ActivityDetailClient() {
    const [activity, setActivity] = useState<Activity | null>(null);
    const [result, setResult] = useState('');
    const [feedback, setFeedback] = useState('');
    const [participantCount, setParticipantCount] = useState(0);
    const [loading, setLoading] = useState(true);

    const router = useRouter();
    const { id: activityId } = useParams() as { id: string }; // params 타입 지정

    useEffect(() => {
        if (!activityId) return;

        const fetchActivity = async () => {
            try {
                const res = await fetch(`/api/activities/${activityId}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });

                if (!res.ok) throw new Error('데이터 조회 실패');
                const json = await res.json();

                const act = json.activity;
                setActivity(act);
                setResult(act.result || '');
                setFeedback(act.feedback || '');
                setParticipantCount(act.participant_count || 0);
            } catch (err) {
                console.error('활동 정보 조회 오류:', err);
                alert('활동 정보를 불러오지 못했습니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchActivity();
    }, [activityId]);

    const handleUpdate = async () => {
        try {
            const res = await fetch(`/api/activities/${activityId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    result,
                    feedback,
                    participant_count: participantCount,
                }),
            });

            if (!res.ok) throw new Error('업데이트 실패');

            const updated = await res.json();
            const updatedActivity =
                updated.activity && !Array.isArray(updated.activity) ? updated.activity : updated.activity[0];
            setActivity(updatedActivity);
            router.refresh(); // 페이지 새로고침
            alert('업데이트 완료!');
        } catch (err) {
            console.error('업데이트 오류:', err);
            alert('업데이트 실패');
        }
    };

    const handleDelete = async () => {
        try {
            const res = await fetch(`/api/activities/${activityId}`, {
                method: 'DELETE',
            });

            if (!res.ok) throw new Error('삭제 실패');
            router.replace('/');
        } catch (err) {
            console.error('삭제 오류:', err);
            alert('삭제 실패');
        }
    };

    if (loading) return <p className="p-4 text-center">불러오는 중...</p>;
    if (!activity) return <p className="p-4 text-center">활동 정보를 찾을 수 없습니다.</p>;

    return (
        <main className="p-4 bg-white min-h-screen text-base">
            <h1 className="text-2xl font-bold mb-6 text-center">📋 활동 상세보기</h1>

            <div className="space-y-4 bg-gray-50 p-4 rounded-2xl shadow">
                <p>
                    📍 <b>장소:</b> {activity.location}
                </p>
                <p>
                    🌐 <b>지역:</b> {activity.region}
                </p>

                <div className="border-t pt-2">
                    ⏰ <b>시간:</b>
                    <div className="pl-4 text-gray-700">
                        <p>시작: {new Date(activity.start_time).toLocaleString()}</p>
                        <p>종료: {new Date(activity.end_time).toLocaleString()}</p>
                    </div>
                </div>

                <p className="border-t pt-2">
                    🛠️ <b>도구:</b> {activity.tool}
                </p>
                <p className="border-t pt-2">
                    📅 <b>작성일:</b>{' '}
                    <span className="text-blue-600 font-semibold">
                        {new Date(activity.created_at).toLocaleDateString()} (
                        {new Date(activity.created_at).toLocaleTimeString()})
                    </span>
                </p>

                <div className="border-t pt-4">
                    👥 <b>참여 인원 수:</b>
                    <input
                        type="number"
                        min={0}
                        value={participantCount}
                        onChange={(e) => {
                            const value = parseInt(e.target.value, 10);
                            if (!isNaN(value)) setParticipantCount(value);
                        }}
                        className="w-full max-w-md border rounded-xl p-3 mt-2 bg-white shadow-inner"
                        placeholder="숫자를 입력하세요"
                    />
                </div>

                <div className="border-t pt-4">
                    📊 <b>결과:</b>
                    <textarea
                        value={result}
                        onChange={(e) => setResult(e.target.value)}
                        className="w-full max-w-md border rounded-xl p-3 mt-2 bg-white shadow-inner"
                        rows={3}
                        placeholder="결과 내용을 입력하세요"
                    />
                </div>

                <div>
                    💬 <b>피드백:</b>
                    <textarea
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        className="w-full max-w-md border rounded-xl p-3 mt-2 bg-white shadow-inner"
                        rows={4}
                        placeholder="피드백을 입력하세요"
                    />
                </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <button
                    onClick={handleUpdate}
                    disabled={loading}
                    className="w-full sm:w-auto bg-green-500 text-white py-3 px-6 rounded-xl shadow hover:bg-green-600"
                >
                    ✅ 수정하기
                </button>
                <button
                    onClick={handleDelete}
                    disabled={loading}
                    className="w-full sm:w-auto bg-red-500 text-white py-3 px-6 rounded-xl shadow hover:bg-red-600"
                >
                    🗑️ 삭제하기
                </button>
            </div>

            <Link href={`/activities/${activityId}/edit`} className="block mt-6 text-center text-blue-500 underline">
                ✏️ 별도 수정 페이지로 이동
            </Link>
        </main>
    );
}
