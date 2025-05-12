'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Loading from '@/app/components/Loading';
import { FaSave, FaTrash, FaArrowLeft, FaTruckLoading, FaEdit } from 'react-icons/fa';

export default function ActivityDetailClient() {
    const [activity, setActivity] = useState<Activity | null>(null);
    const [result, setResult] = useState<Participant[]>([{ name: '', phone: '', lead: '', type: '', team: '' }]);
    const [feedback, setFeedback] = useState<Feedback>({ strengths: '', improvements: '', futurePlans: '' });
    const [participantCount, setParticipantCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const router = useRouter();
    const { id: activityId } = useParams() as { id: string };

    const [canEdit, setCanEdit] = useState(false);

    useEffect(() => {
        if (!activityId) return;

        const fetchActivity = async () => {
            try {
                const res = await fetch(`/api/activities/${activityId}`);
                if (!res.ok) throw new Error('데이터 조회 실패');
                const json = await res.json();
                const act = json.activity;
                setActivity(act);
                setResult(act.result || [{ name: '', phone: '', lead: '', type: '', team: '' }]);
                setFeedback(act.feedback ? act.feedback : { strengths: '', improvements: '', futurePlans: '' });
                setParticipantCount(act.participant_count || 0);

                const startTime = new Date(act.start_time).getTime();
                const currentTime = Date.now();
                const threeHoursBeforeStart = startTime - 3 * 60 * 60 * 1000;
                setCanEdit(currentTime < threeHoursBeforeStart);
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

        setIsUpdating(true);

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
        } finally {
            setIsUpdating(false);
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
    if (!activity) return <p className="text-center py-10 text-red-500 text-sm">활동 정보를 찾을 수 없습니다.</p>;

    return (
        <main className="max-w-4xl mx-auto px-6 py-10 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 flex items-center justify-center gap-2">
                <span>📋</span> 활동 상세
            </h1>

            <div className="bg-white rounded-3xl shadow-xl p-8 space-y-6">
                <section className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-6">
                    <div>
                        <p className="text-sm text-gray-600">
                            <span className="font-semibold">📍 장소:</span> {activity.location}
                        </p>
                        <p className="text-sm text-gray-600">
                            <span className="font-semibold">🌐 지역:</span> {activity.region}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">
                            <span className="font-semibold">🛠️ 도구:</span> {activity.tool}
                        </p>
                        <p className="text-sm text-gray-600">
                            <span className="font-semibold">📅 작성일:</span>{' '}
                            <span className="text-blue-600">
                                {new Date(activity.created_at).toLocaleDateString()} (
                                {new Date(activity.created_at).toLocaleTimeString()})
                            </span>
                        </p>
                    </div>
                </section>

                <section className="border-t pt-6">
                    <p className="text-sm font-semibold text-gray-700">⏰ 시간</p>
                    <div className="flex flex-wrap gap-8 mt-2 text-sm text-gray-600">
                        <p>시작: {activity.start_time}</p>
                        <p>종료: {activity.end_time}</p>
                    </div>
                </section>
                <section className="border-t pt-6">
                    <p className="text-sm text-gray-600">
                        <span className="font-semibold">주관자:</span> {activity.host}
                    </p>
                    <p className="text-sm text-gray-600">
                        <span className="font-semibold">주관자 연락처:</span> {activity.hostnumber}
                    </p>
                </section>

                {/* Participant Count */}
                <section className="border-t pt-6">
                    <label className="block text-sm font-semibold text-gray-700">👥 참여 인원 수</label>
                    <input
                        type="number"
                        min={0}
                        value={participantCount}
                        onChange={(e) => {
                            const value = parseInt(e.target.value, 10);
                            if (!isNaN(value)) setParticipantCount(value);
                        }}
                        className="w-full max-w-xs border rounded-lg p-4 mt-1 bg-gray-50 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-sm"
                        placeholder="숫자를 입력하세요"
                    />
                </section>

                {/* Result Input */}
                <section className="border-t pt-6">
                    <div className="flex justify-between items-center mb-4">
                        <label className="text-sm font-semibold text-gray-700">
                            📊 결과 입력 <span className="text-gray-400 text-xs">({result.length}건)</span>
                        </label>
                        <button
                            onClick={() =>
                                setResult([...result, { name: '', lead: '', phone: '', type: '', team: '' }])
                            }
                            className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                        >
                            + 참여자 추가
                        </button>
                    </div>

                    <div className="space-y-6">
                        {result.map((p, idx) => (
                            <div key={idx} className="border rounded-lg p-6 bg-gray-50 shadow-md">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600">이름</label>
                                        <input
                                            type="text"
                                            value={p.name}
                                            onChange={(e) => {
                                                const updated = [...result];
                                                updated[idx].name = e.target.value;
                                                setResult(updated);
                                            }}
                                            className="w-full border rounded-lg p-4 text-sm bg-white focus:ring-2 focus:ring-blue-400"
                                            placeholder="이름"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600">팀</label>
                                        <select
                                            value={p.team}
                                            onChange={(e) => {
                                                const updated = [...result];
                                                updated[idx].team = e.target.value;
                                                setResult(updated);
                                            }}
                                            className="w-full border rounded-lg p-4 text-sm bg-white focus:ring-2 focus:ring-blue-400"
                                        >
                                            <option value="">선택</option>
                                            <option value="1팀">1팀</option>
                                            <option value="2팀">2팀</option>
                                            <option value="3팀">3팀</option>
                                            <option value="4팀">4팀</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600">인도자</label>
                                        <input
                                            type="text"
                                            value={p.lead}
                                            onChange={(e) => {
                                                const updated = [...result];
                                                updated[idx].lead = e.target.value;
                                                setResult(updated);
                                            }}
                                            className="w-full border rounded-lg p-4 text-sm bg-white focus:ring-2 focus:ring-blue-400"
                                            placeholder="인도자"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600">전화 뒷자리</label>
                                        <input
                                            type="text"
                                            value={p.phone}
                                            onChange={(e) => {
                                                const updated = [...result];
                                                updated[idx].phone = e.target.value;
                                                setResult(updated);
                                            }}
                                            maxLength={4}
                                            className="w-full border rounded-lg p-4 text-sm bg-white focus:ring-2 focus:ring-blue-400"
                                            placeholder="뒷자리"
                                        />
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <label className="block text-xs font-semibold text-gray-600">유형</label>
                                    <input
                                        type="text"
                                        value={p.type}
                                        onChange={(e) => {
                                            const updated = [...result];
                                            updated[idx].type = e.target.value;
                                            setResult(updated);
                                        }}
                                        className="w-full border rounded-lg p-4 text-sm bg-white focus:ring-2 focus:ring-blue-400"
                                        placeholder="유형"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Feedback */}
                <section className="border-t pt-6">
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-700">💬 잘한점</label>
                        <textarea
                            rows={4}
                            value={feedback.strengths}
                            onChange={(e) => setFeedback({ ...feedback, strengths: e.target.value })}
                            placeholder="잘한점"
                            className="w-full border rounded-lg p-4 mt-2 bg-gray-50 focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-700">💬 보완할 점</label>
                        <textarea
                            rows={4}
                            value={feedback.improvements}
                            onChange={(e) => setFeedback({ ...feedback, improvements: e.target.value })}
                            placeholder="개선점"
                            className="w-full border rounded-lg p-4 mt-2 bg-gray-50 focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700">💬 다음에 적용할 점</label>
                        <textarea
                            rows={4}
                            value={feedback.futurePlans}
                            onChange={(e) => setFeedback({ ...feedback, futurePlans: e.target.value })}
                            placeholder="다음에는 이런 부분을 보완 해서 해보겠다"
                            className="w-full border rounded-lg p-4 mt-2 bg-gray-50 focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                </section>

                {/* Buttons */}
                <div className="mt-8 flex justify-between gap-4">
                    <Link href={`/activities/${activityId}/edit`} passHref>
                        <button
                            disabled={!canEdit}
                            className={`flex items-center ${
                                !canEdit ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500'
                            } text-white py-2 px-4 rounded-lg`}
                        >
                            <FaEdit className="mr-2" /> 활동내용 수정
                        </button>
                    </Link>
                    <div className="flex gap-4">
                        <Link href="/" passHref>
                            <button className="flex items-center bg-yellow-500 text-white py-2 px-4 rounded-lg">
                                <FaArrowLeft className="mr-2" /> 홈으로
                            </button>
                        </Link>
                        <button
                            onClick={handleDelete}
                            disabled={!canEdit}
                            className={`flex items-center ${
                                !canEdit ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-500'
                            } text-white py-2 px-4 rounded-lg`}
                        >
                            <FaTrash className="mr-2" /> 삭제
                        </button>
                        <button
                            onClick={handleUpdate}
                            disabled={isUpdating}
                            className="flex items-center bg-green-500 text-white py-2 px-4 rounded-lg"
                        >
                            {isUpdating ? (
                                <>
                                    <FaTruckLoading className="mr-2 animate-spin" /> 업데이트 중...
                                </>
                            ) : (
                                <>
                                    <FaSave className="mr-2" /> 업데이트
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}
