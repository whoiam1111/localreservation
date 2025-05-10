'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Session } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

import Calendar from './components/Calendar';
import { Plus } from 'lucide-react';
import Modal from './components/Modal';

export default function HomePage() {
    const supabase = createClientComponentClient();
    const router = useRouter();

    const [session, setSession] = useState<Session | null | undefined>(undefined);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [bibleContent, setBibleContent] = useState<{
        verses: string;
        book_name: string;
        chapter_number: number;
        date_used: string;
    } | null>(null);

    const fetchSession = useCallback(async () => {
        const {
            data: { session },
        } = await supabase.auth.getSession();
        setSession(session);
    }, [supabase]);

    useEffect(() => {
        fetchSession();

        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => listener.subscription.unsubscribe();
    }, [fetchSession, supabase]);

    const handleLogout = async () => {
        const confirmed = window.confirm('로그아웃 하시겠습니까?');
        if (!confirmed) return;

        await fetch('/api/logout', { method: 'POST' });
        setSession(null);
        router.refresh(); // 최신 상태 반영
    };

    // HomePage에서 handleTodayVerse 수정
    const handleTodayVerse = async () => {
        try {
            const res = await fetch(`/api/verses?date=${new Date().toISOString().split('T')[0]}`, {
                method: 'GET',
            });

            if (!res.ok) {
                throw new Error('성구를 가져오는 데 문제가 발생했습니다.');
            }

            const data = await res.json();
            console.log(data);

            // 받은 데이터를 상태에 설정
            setBibleContent(data || null);
            setIsModalOpen(true);
        } catch (error) {
            console.error('성구를 가져오는 데 실패했습니다:', error);
            setBibleContent(null);
            setIsModalOpen(true);
        }
    };

    // 세션 확인 중일 땐 빈 화면 혹은 로딩 스피너를 반환 (선택적)
    if (session === undefined) {
        return (
            <main className="flex justify-center items-center min-h-screen bg-white">
                <div className="text-gray-500">세션 확인 중...</div>
            </main>
        );
    }

    return (
        <main className="p-4 relative min-h-screen bg-gray-50">
            <header className="bg-blue-500 p-4">
                <nav className="flex justify-between items-center max-w-screen-xl mx-auto">
                    <div>
                        <button
                            onClick={handleTodayVerse}
                            className="text-white text-sm sm:text-base bg-yellow-500 hover:bg-yellow-600 py-2 px-4 rounded-lg shadow-md transform transition-all duration-300 hover:scale-105"
                        >
                            오늘의 씨
                        </button>
                    </div>
                    <div className="flex gap-6">
                        {!session ? (
                            <>
                                <button
                                    onClick={() => router.push('/login')}
                                    className="text-white text-sm sm:text-base hover:underline"
                                >
                                    관리자 로그인
                                </button>
                                <button
                                    onClick={() => router.push('/add')}
                                    className="flex items-center text-white text-sm sm:text-base hover:underline"
                                >
                                    <Plus className="w-5 h-5 mr-2" />
                                    일정 추가
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => router.push('/admin')}
                                    className="text-white text-sm sm:text-base hover:underline"
                                >
                                    관리자 메뉴
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="text-white text-sm sm:text-base hover:underline"
                                >
                                    로그아웃
                                </button>
                            </>
                        )}
                    </div>
                </nav>
            </header>

            <Calendar />

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} content={bibleContent} />
        </main>
    );
}
