'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ActivityForm() {
    const router = useRouter();
    const [region, setRegion] = useState('');
    const [date, setDate] = useState('');
    const [location, setLocation] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [tool, setTool] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const newActivity = {
            region,
            date,
            location,
            startTime: `${date}T${startTime}`,
            endTime: `${date}T${endTime}`,
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
        <main className="max-w-md mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-center  mb-6">📋 활동 등록</h1>
            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-2xl shadow-md">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">소속 지역</label>
                    <select
                        value={region}
                        onChange={(e) => setRegion(e.target.value)}
                        className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
                        required
                    >
                        <option value="">선택하세요</option>
                        <option value="도봉">도봉</option>
                        <option value="성북">성북</option>
                        <option value="노원">노원</option>
                        <option value="중랑">중랑</option>
                        <option value="강북">강북</option>
                        <option value="대학">대학</option>
                        <option value="새신자">새신자</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">날짜</label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">장소</label>
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
                        required
                    />
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">시작 시간</label>
                        <input
                            type="time"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
                            required
                        />
                    </div>
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">종료 시간</label>
                        <input
                            type="time"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">도구</label>
                    <input
                        type="text"
                        value={tool}
                        onChange={(e) => setTool(e.target.value)}
                        className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-lg font-semibold transition"
                >
                    ✅ 저장하기
                </button>
            </form>

            <button
                onClick={() => router.push('/')}
                className="w-full mt-4 bg-gray-300 hover:bg-gray-400 text-black py-3 rounded-xl text-lg font-semibold transition"
            >
                🏠 홈으로
            </button>
        </main>
    );
}
