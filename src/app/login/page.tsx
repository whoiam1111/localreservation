'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function LoginPage() {
    const supabase = createClientComponentClient();
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
            if (data.session) {
                router.replace('/');
            }
        });
    }, [router, supabase]);

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
        } else {
            router.replace('/');
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-100">
            <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md w-80 space-y-4">
                <h2 className="text-lg font-bold text-center">관리자 로그인</h2>
                <input
                    type="email"
                    placeholder="이메일"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border p-2 w-full"
                />
                <input
                    type="password"
                    placeholder="비밀번호"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border p-2 w-full"
                />
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded w-full">
                    로그인
                </button>
                {error && <p className="text-red-500 text-sm">{error}</p>}
            </form>
        </main>
    );
}
