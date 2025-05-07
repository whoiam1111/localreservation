'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Session } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

import Calendar from './components/Calendar';
import AddButton from './components/AddButton';
import { Plus } from 'lucide-react';

export default function HomePage() {
    const supabase = createClientComponentClient();
    const router = useRouter();

    const [session, setSession] = useState<Session | null>(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
            setSession(data.session);
        });

        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => {
            listener.subscription.unsubscribe();
        };
    }, [supabase]);

    const handleLogout = async () => {
        const confirmed = window.confirm('로그아웃 하시겠습니까?');
        if (!confirmed) return;

        await supabase.auth.signOut();
        setSession(null);
    };

    return (
        <main className="p-4 relative min-h-screen bg-white">
            <Calendar />

            {!session && (
                <button
                    onClick={() => router.push('/login')}
                    className="absolute top-4 right-32 text-xs bg-blue-500 text-white px-2 py-2 rounded"
                >
                    관리자 로그인
                </button>
            )}
            <AddButton href="/add" label="일정추가" icon={<Plus className="w-5 h-5" />} />
            <AddButton href="/admin" label="관리자메뉴" icon="" />
            {session && (
                <>
                    <button
                        onClick={handleLogout}
                        className="absolute top-4 right-32 text-xs bg-red-500 text-white px-2 py-2 rounded"
                    >
                        로그아웃
                    </button>
                </>
            )}
        </main>
    );
}
