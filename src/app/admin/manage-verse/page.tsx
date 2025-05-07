'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function ManageBibleVerses() {
    const supabase = createClientComponentClient();

    const [bibleVerses, setBibleVerses] = useState<string[]>([]);
    const [newVerse, setNewVerse] = useState('');

    useEffect(() => {
        const fetchBibleVerses = async () => {
            const { data, error } = await supabase.from('bible_verses').select('*');
            if (data) {
                setBibleVerses(data.map((item: { verse: string }) => item.verse));
            } else if (error) {
                console.error('Error fetching bible verses:', error); // Log error if needed
            }
        };

        fetchBibleVerses();
    }, [supabase]); // Add supabase to the dependency array

    // Handle adding a new verse to the database
    const handleAddVerse = async () => {
        if (newVerse.trim()) {
            const { error } = await supabase.from('bible_verses').insert([{ verse: newVerse }]);
            if (error) {
                alert('성구 추가에 실패했습니다.');
            } else {
                setBibleVerses((prevVerses) => [...prevVerses, newVerse]); // Add the new verse to the list
                setNewVerse('');
            }
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-3xl font-bold mb-4">오늘의 성구 관리</h1>

            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">성구 추가</h2>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newVerse}
                        onChange={(e) => setNewVerse(e.target.value)}
                        placeholder="성구를 입력하세요"
                        className="border p-2 w-full rounded"
                    />
                    <button onClick={handleAddVerse} className="bg-green-500 text-white px-4 py-2 rounded">
                        추가
                    </button>
                </div>
            </div>

            <div className="mt-4">
                <h3 className="font-medium">오늘의 성구</h3>
                <ul className="list-disc pl-5 mt-2">
                    {bibleVerses.map((verse, index) => (
                        <li key={index}>{verse}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
