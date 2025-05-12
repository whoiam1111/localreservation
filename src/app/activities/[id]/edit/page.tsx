'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/app/lib/supabase';
import Loading from '@/app/components/Loading';
import { REGION_OPTIONS } from '@/app/lib/constants';

export default function EditActivityClient() {
    const [activity, setActivity] = useState<Activity | null>(null);
    const [isHostUnspecified, setIsHostUnspecified] = useState(true); // "미정" 체크 여부
    const [host, setHost] = useState('');
    const [hostNumber, setHostNumber] = useState('');
    const router = useRouter();
    const params = useParams();
    const activityId = params?.id as string;

    useEffect(() => {
        const fetchActivity = async () => {
            const { data, error } = await supabase.from('activities').select('*').eq('id', activityId).single();

            if (error || !data) {
                console.error('Error fetching activity:', error);
                router.push('/404');
            } else {
                setActivity(data);
                setIsHostUnspecified(data.host === '미정'); // 기존 주관자가 '미정'이면 체크박스 체크
                setHost(data.host !== '미정' ? data.host : ''); // 주관자 이름 설정
                setHostNumber(data.hostnumber || ''); // 주관자 연락처 설정
            }
        };

        fetchActivity();
    }, [activityId, router]);

    if (!activity) {
        return <Loading />;
    }

    const handleSubmit = async (formData: FormData) => {
        const date = formData.get('date') as string;
        const startTime = formData.get('startTime') as string;
        const endTime = formData.get('endTime') as string;

        const updated = {
            location: formData.get('location'),
            start_time: startTime,
            end_time: endTime,
            tool: formData.get('tool'),
            region: formData.get('region'),
            date,
            host: isHostUnspecified ? '미정' : host, // 주관자 값 설정
            hostnumber: hostNumber, // 주관자 연락처
        };

        const { error } = await supabase.from('activities').update(updated).eq('id', activityId);

        if (error) {
            console.error('활동 수정 실패:', error.message);
            return;
        }

        router.push(`/activities/${activityId}`);
    };

    return (
        <main className="max-w-md mx-auto px-4 py-8">
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target as HTMLFormElement);
                    handleSubmit(formData);
                }}
                className="space-y-6 bg-white p-6 rounded-2xl shadow-md"
            >
                <h1 className="text-2xl font-bold text-center mb-6">✏️ 활동 수정</h1>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">날짜</label>
                    <input
                        name="date"
                        type="date"
                        defaultValue={activity.date}
                        className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">장소</label>
                    <input
                        name="location"
                        defaultValue={activity.location}
                        className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                    />
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">시작 시간</label>
                        <input
                            name="startTime"
                            type="time"
                            defaultValue={activity.start_time}
                            className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                        />
                    </div>

                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">종료 시간</label>
                        <input
                            name="endTime"
                            type="time"
                            defaultValue={activity.end_time}
                            className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">도구</label>
                    <input
                        name="tool"
                        defaultValue={activity.tool}
                        className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">지역</label>
                    <select
                        name="region"
                        defaultValue={activity.region}
                        className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                    >
                        {REGION_OPTIONS.map((region) => (
                            <option key={region} value={region}>
                                {region}
                            </option>
                        ))}
                    </select>
                </div>

                {/* 주관자 미정 체크박스 */}
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={isHostUnspecified}
                        onChange={(e) => setIsHostUnspecified(e.target.checked)}
                        className="w-4 h-4"
                    />
                    <label className="text-sm font-medium text-gray-700">주관자 미정</label>
                </div>

                {/* 주관자 이름 입력 필드 (미정이 아닐 경우) */}
                {!isHostUnspecified && (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">주관자</label>
                            <input
                                name="host"
                                value={host}
                                onChange={(e) => setHost(e.target.value)}
                                className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">주관자 연락처</label>
                            <input
                                name="hostNumber"
                                value={hostNumber}
                                onChange={(e) => setHostNumber(e.target.value)}
                                className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                                required
                            />
                        </div>
                    </>
                )}

                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-lg font-semibold transition duration-200"
                >
                    저장하기
                </button>
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="w-full bg-gray-300 hover:bg-gray-400 text-black py-3 rounded-xl text-lg font-semibold transition duration-200 mb-6"
                >
                    돌아가기
                </button>
            </form>
        </main>
    );
}
