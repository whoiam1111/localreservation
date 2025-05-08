'use client';

import { supabase } from '@/app/lib/supabase';
import { useState } from 'react';

export default function ManageBibleVerses() {
    const [bibleVerses, setBibleVerses] = useState<string[]>([]);
    const [newVerse, setNewVerse] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);

    const handleAddVerse = async () => {
        if (newVerse.trim()) {
            const { error } = await supabase.from('bible_verses').insert([{ verse: newVerse }]);
            if (error) {
                alert('성구 추가에 실패했습니다.');
            } else {
                setBibleVerses((prevVerses) => [...prevVerses, newVerse]); // Add
                setNewVerse('');
            }
        }
    };

    const handleSearch = async () => {
        if (searchQuery.trim()) {
            const { data, error } = await supabase.rpc('search_bible_verses', { query: searchQuery });

            if (data) {
                console.log(data, '?data');
                setSearchResults(data);
            } else {
                console.error('Error searching bible verses:', error);
                alert('성구 검색에 실패했습니다.');
            }
        } else {
            setSearchResults([]);
        }
    };

    const handleSelectVerse = async (
        verse: string,
        book_name: string,
        chapter_number: number,
        verse_number: number
    ) => {
        const { error } = await supabase.from('today_bible_verses').insert([
            {
                verse,
                book_name,
                chapter_number,
                verse_number,
            },
        ]);
        if (error) {
            alert('오늘의 성구 등록에 실패했습니다.');
        } else {
            alert('오늘의 성구로 등록되었습니다!');
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-3xl font-bold mb-4">오늘의 성구 관리</h1>

            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">성구 검색</h2>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="성구를 검색하세요"
                        className="border p-2 w-full rounded"
                    />
                    <button onClick={handleSearch} className="bg-blue-500 text-white px-4 py-2 rounded">
                        검색
                    </button>
                </div>
                {searchResults.length > 0 && (
                    <div className="mt-4">
                        <h3 className="font-medium">검색 결과</h3>
                        <ul className="list-disc pl-5 mt-2">
                            {searchResults.map((result, index) => (
                                <li
                                    key={index}
                                    className="cursor-pointer"
                                    onClick={() =>
                                        handleSelectVerse(
                                            result.verse_text,
                                            result.book_name,
                                            result.chapter_number,
                                            result.verse_number
                                        )
                                    }
                                >
                                    {result.book_name} {result.chapter_number}:{result.verse_text}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

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
