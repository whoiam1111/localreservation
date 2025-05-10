'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Loading from '@/app/components/Loading';

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
    const [result, setResult] = useState([{ name: '', phone: '', lead: '', type: '', team: '' }]);

    const [feedback, setFeedback] = useState('');
    const [participantCount, setParticipantCount] = useState(0);
    const [loading, setLoading] = useState(true);

    const router = useRouter();
    const { id: activityId } = useParams() as { id: string };

    useEffect(() => {
        if (!activityId) return;

        const fetchActivity = async () => {
            try {
                const res = await fetch(`/api/activities/${activityId}`);
                if (!res.ok) throw new Error('데이터 조회 실패');
                const json = await res.json();
                const act = json.activity;
                setActivity(act);

                console.log(act, 'act');
                setResult(act.result || [{ name: '', phone: '', lead: '', type: '', team: '' }]);
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
        if (!activity) {
            alert('활동 정보가 없습니다.');
            return;
        }

        try {
            const res = await fetch(`/api/activities/${activityId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ result, feedback, participant_count: participantCount }),
            });

            if (!res.ok) throw new Error('업데이트 실패');
            const updated = await res.json();
            setActivity(updated.activity);
            router.refresh();

            for (const p of result) {
                if (p.name && p.phone) {
                    await fetch('/api/spreadsheet', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            name: p.name,
                            phone_suffix: p.phone,
                            lead: p.lead || '',
                            type: p.type || '',
                            team: p.team || '',
                            region: activity.region,
                            location: updated.activity.location,
                            date: new Date(updated.activity.created_at).toLocaleDateString(),
                        }),
                    });
                }
            }

            alert('업데이트 완료!');
        } catch (err) {
            console.error('업데이트 오류:', err);
            alert('업데이트 실패');
        }
    };

    const handleDelete = async () => {
        try {
            const res = await fetch(`/api/activities/${activityId}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('삭제 실패');
            router.replace('/');
        } catch (err) {
            console.error('삭제 오류:', err);
            alert('삭제 실패');
        }
    };

    if (loading) return <Loading />;
    if (!activity) return <p className="text-center py-10 text-red-500">활동 정보를 찾을 수 없습니다.</p>;

    return (
        <main className="max-w-3xl mx-auto px-6 py-10 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">📋 활동 상세보기</h1>

            <div className="bg-white rounded-2xl shadow-md p-6 space-y-6">
                <section>
                    <p className="text-lg">
                        <span className="font-semibold">📍 장소:</span> {activity.location}
                    </p>
                    <p className="text-lg">
                        <span className="font-semibold">🌐 지역:</span> {activity.region}
                    </p>
                </section>

                <section className="border-t pt-4">
                    <p className="text-lg font-semibold">⏰ 시간</p>
                    <div className="pl-4 text-gray-700 space-y-1">
                        <p>시작: {activity.start_time}</p>
                        <p>종료: {activity.end_time}</p>
                    </div>
                </section>

                <section className="border-t pt-4">
                    <p className="text-lg">
                        <span className="font-semibold">🛠️ 도구:</span> {activity.tool}
                    </p>
                </section>

                <section className="border-t pt-4">
                    <p className="text-lg">
                        <span className="font-semibold">📅 작성일:</span>{' '}
                        <span className="text-blue-600 font-medium">
                            {new Date(activity.created_at).toLocaleDateString()} (
                            {new Date(activity.created_at).toLocaleTimeString()})
                        </span>
                    </p>
                </section>

                <section className="border-t pt-4">
                    <label className="block font-semibold mb-1">👥 참여 인원 수</label>
                    <input
                        type="number"
                        min={0}
                        value={participantCount}
                        onChange={(e) => {
                            const value = parseInt(e.target.value, 10);
                            if (!isNaN(value)) setParticipantCount(value);
                        }}
                        className="w-full max-w-md border rounded-xl p-3 mt-1 bg-white shadow-inner"
                        placeholder="숫자를 입력하세요"
                    />
                </section>
                <section className="border-t pt-4">
                    <div className="flex justify-between items-center mb-2">
                        <label className="block font-semibold">📊 결과</label>
                        <button
                            onClick={() =>
                                setResult([...result, { name: '', lead: '', phone: '', type: '', team: '' }])
                            }
                            className="text-sm text-blue-600 hover:underline"
                        >
                            + 추가
                        </button>
                    </div>

                    {result.map((p, idx) => (
                        <div
                            key={idx}
                            className="flex flex-col sm:flex-row sm:gap-4 gap-2 items-start sm:items-center mb-4"
                        >
                            <input
                                type="text"
                                value={p.name}
                                onChange={(e) => {
                                    const updated = [...result];
                                    updated[idx].name = e.target.value;
                                    setResult(updated);
                                }}
                                className="w-full sm:w-32 border rounded-xl p-2 bg-white shadow-inner"
                                placeholder="이름"
                            />
                            <select
                                value={p.team}
                                onChange={(e) => {
                                    const updated = [...result];
                                    updated[idx].team = e.target.value;
                                    setResult(updated);
                                }}
                                className="w-full sm:w-36 border rounded-xl p-2 bg-white shadow-inner"
                            >
                                <option value="">선택</option>
                                <option value="1팀">1팀</option>
                                <option value="2팀">2팀</option>
                                <option value="3팀">3팀</option>
                                <option value="4팀">4팀</option>
                            </select>
                            <input
                                type="text"
                                value={p.lead}
                                onChange={(e) => {
                                    const updated = [...result];
                                    updated[idx].lead = e.target.value;
                                    setResult(updated);
                                }}
                                className="w-full sm:w-32 border rounded-xl p-2 bg-white shadow-inner"
                                placeholder="인도자"
                            />
                            <input
                                type="text"
                                value={p.phone}
                                onChange={(e) => {
                                    const updated = [...result];
                                    updated[idx].phone = e.target.value;
                                    setResult(updated);
                                }}
                                className="w-full sm:w-24 border rounded-xl p-2 bg-white shadow-inner"
                                placeholder="뒷자리"
                                maxLength={4}
                            />
                            <select
                                value={p.type}
                                onChange={(e) => {
                                    const updated = [...result];
                                    updated[idx].type = e.target.value;
                                    setResult(updated);
                                }}
                                className="w-full sm:w-36 border rounded-xl p-2 bg-white shadow-inner"
                            >
                                <option value="">선택</option>
                                <option value="인터뷰확정">인터뷰확정</option>
                                <option value="상담확정">상담확정</option>
                                <option value="연락처확보">연락처확보</option>
                                <option value="공격스피치">공격스피치</option>
                            </select>
                            <button
                                onClick={() => {
                                    const updated = [...result];
                                    updated.splice(idx, 1);
                                    setResult(updated);
                                }}
                                className="text-red-500 hover:text-red-700 text-sm mt-1 sm:mt-0"
                            >
                                삭제
                            </button>
                        </div>
                    ))}
                </section>

                <section>
                    <label className="block font-semibold mb-1">💬 피드백</label>
                    <textarea
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        className="w-full max-w-md border rounded-xl p-3 mt-1 bg-white shadow-inner"
                        rows={4}
                        placeholder="피드백을 입력하세요"
                    />
                </section>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
                <button
                    onClick={handleUpdate}
                    disabled={loading}
                    className="flex-1 sm:flex-none bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-xl shadow text-lg"
                >
                    ✅ 수정하기
                </button>
                <button
                    onClick={handleDelete}
                    disabled={loading}
                    className="flex-1 sm:flex-none bg-red-500 hover:bg-red-600 text-white py-3 px-6 rounded-xl shadow text-lg"
                >
                    🗑️ 삭제하기
                </button>
            </div>

            <div className="mt-4 text-center">
                <Link
                    href="/"
                    className="inline-block bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-5 rounded-xl text-base shadow"
                >
                    🏠 홈으로
                </Link>
            </div>

            <div className="mt-8 text-center">
                <Link
                    href={`/activities/${activityId}/edit`}
                    className="text-blue-600 hover:underline text-base"
                >
                    활동 수정 페이지로 이동
                </Link>
            </div>
        </main>
    );
}
