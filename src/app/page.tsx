'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Session } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

import Calendar from './components/Calendar';
import { Plus } from 'lucide-react';
import Modal from './components/Modal';
import Seed from '../app/components/Seed';
import { BibleVerse } from '../app/lib/type'; // { book_name: string, chapter: number, verse: string, text: string, card_type: string }

type Scripture = {
    book_name: string;
    chapter: number;
    verse: number;
    text: string;
    card_type: string;
};

export default function HomePage() {
    const supabase = createClientComponentClient();
    const router = useRouter();

    const [session, setSession] = useState<Session | null | undefined>(undefined);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [scriptures, setScriptures] = useState<Scripture[] | null>(null);

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
        router.refresh();
    };

    const handleTodayVerse = async () => {
        try {
            const res = await fetch('/api/verses');
            if (!res.ok) throw new Error('성구 불러오기 실패');

            const data: BibleVerse[] = await res.json();

            const types = ['용기', '전도', '소망'];
            const selected: BibleVerse[] = [];

            types.forEach((type) => {
                const versesForType = data.filter((v) => v.card_type === type);
                if (versesForType.length === 0) return;

                const randomIndex = Math.floor(Math.random() * versesForType.length);
                selected.push(versesForType[randomIndex]);
            });

            if (selected.length < 3) {
                alert('📖 각 카드 타입별로 성구가 충분하지 않습니다.');
                return;
            }

            // 🔁 verse(string) → number로 변환
            const converted: Scripture[] = selected.map((v) => ({
                ...v,
                verse: parseInt(v.verse, 10),
            }));

            setScriptures(converted);
            setIsModalOpen(true);
        } catch (error) {
            console.error('성구 불러오기 오류:', error);
            alert('📖 성구를 가져오는 데 실패했습니다.');
        }
    };

    const cardImages = ['/images/courage.jpg', '/images/evangelism.jpg', '/images/wish.jpg'];
    const backImages = ['/images/courageBack.jpg', '/images/evangelismBack.jpg', '/images/wishBack.jpg'];

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
                <nav className="flex justify-between items-center">
                    <div>
                        <button
                            onClick={handleTodayVerse}
                            className="text-white text-sm sm:text-base bg-yellow-500 hover:bg-yellow-600 py-2 px-4 rounded-lg shadow-md transform transition-all duration-300 hover:scale-105"
                        >
                            오늘의 씨
                        </button>
                    </div>
                    <div className="flex gap-6">
                        <button
                            onClick={() => router.push('/add')}
                            className="flex items-center text-white text-sm sm:text-base hover:underline"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            일정 추가
                        </button>
                        {!session ? (
                            <button
                                onClick={() => router.push('/login')}
                                className="text-white text-sm sm:text-base hover:underline"
                            >
                                관리자 로그인
                            </button>
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

            {scriptures && (
                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                    <Seed scriptures={scriptures} cardImages={cardImages} backImages={backImages} />
                </Modal>
            )}
        </main>
    );
}
