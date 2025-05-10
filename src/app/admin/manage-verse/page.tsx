'use client';

import { supabase } from '@/app/lib/supabase';
import { useState, useEffect } from 'react';

type BibleSearchResult = {
    verse_text: string;
    book_name: string;
    chapter_number: number;
    verse_number: number;
};

type TodayBibleVerse = {
    id: number;
    verses: string;
    book_name: string;
    chapter_number: number;
    date_used: string;
};

export default function ManageBibleVerses() {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<BibleSearchResult[]>([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [todayBibleVerses, setTodayBibleVerses] = useState<TodayBibleVerse[]>([]);

    // 성구 검색 처리
    const handleSearch = async () => {
        if (searchQuery.trim()) {
            const { data, error } = await supabase.rpc('search_bible_verses', { query: searchQuery });

            if (data) {
                setSearchResults(data);
            } else {
                console.error('Error searching bible verses:', error);
                alert('성구 검색에 실패했습니다.');
            }
        } else {
            setSearchResults([]);
        }
    };

    // 성구 선택 후 오늘의 성구로 등록
    const handleSelectVerse = async (verse: BibleSearchResult) => {
        const { verse_text, book_name, chapter_number } = verse;

        if (!selectedDate) {
            alert('날짜를 먼저 선택해주세요.');
            return;
        }

        const { error } = await supabase.from('today_bible_verses').insert([
            {
                verses: verse_text,
                book_name,
                chapter_number,
                date_used: selectedDate, // 사용자가 선택한 날짜 사용
            },
        ]);

        if (error) {
            alert('오늘의 성구 등록에 실패했습니다.');
            console.error(error);
        } else {
            alert(`"${book_name} ${chapter_number}" 성구가 ${selectedDate} 날짜로 등록되었습니다!`);
            fetchTodayBibleVerses();  // 성구가 등록된 후 리스트를 새로 고침
        }
    };

    // 오늘의 성구 목록 가져오기 (날짜 순으로 정렬)
    const fetchTodayBibleVerses = async () => {
        const { data, error } = await supabase
            .from('today_bible_verses')
            .select('*')
            .order('date_used', { ascending: false });  // 날짜 내림차순 정렬 (가장 최근 날짜가 위로)

        if (error) {
            console.error('오늘의 성구 불러오기 실패:', error);
        } else {
            setTodayBibleVerses(data);
        }
    };

    // 성구 삭제 처리
    const handleDeleteVerse = async (id: number) => {
        const { error } = await supabase.from('today_bible_verses').delete().match({ id });

        if (error) {
            alert('성구 삭제에 실패했습니다.');
            console.error(error);
        } else {
            alert('오늘의 성구가 삭제되었습니다.');
            fetchTodayBibleVerses();  // 삭제 후 리스트 새로 고침
        }
    };

    // 검색어 하이라이트 처리
    const highlightText = (text: string, query: string) => {
        if (!query) return text;
        const regex = new RegExp(`(${query})`, 'gi'); // 검색어 대소문자 구분 없이 매칭
        return text.replace(regex, `<span class="bg-yellow-300">$1</span>`); // 하이라이트 스타일
    };

    // 컴포넌트가 마운트될 때 오늘의 성구 목록 불러오기
    useEffect(() => {
        fetchTodayBibleVerses();
    }, []);

    return (
        <div className="p-6 max-w-4xl mx-auto bg-white shadow-md rounded-lg">
            <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">오늘의 성구 관리</h1>

            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">성구 검색</h2>
                <div className="flex items-center gap-4 mb-4">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="성구를 검색하세요"
                        className="border border-gray-300 p-3 w-3/4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        onClick={handleSearch}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 flex justify-center items-center"
                    >
                        검색
                    </button>
                </div>

                {/* 날짜 선택 칸을 검색창 바로 아래로 배치 */}
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">날짜 선택</h2>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {searchResults.length > 0 && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-lg mb-2">검색 결과</h3>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                            {searchResults.map((result, index) => (
                                <div
                                    key={index}
                                    className="cursor-pointer p-3 bg-white rounded-lg shadow hover:shadow-lg transition"
                                    onClick={() => handleSelectVerse(result)}
                                >
                                    <p className="font-medium text-gray-800">
                                        {result.book_name} {result.chapter_number}:{result.verse_number}
                                    </p>
                                    <p className="text-gray-600" dangerouslySetInnerHTML={{
                                        __html: highlightText(result.verse_text, searchQuery)
                                    }} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-6">
                <h3 className="font-medium text-lg">오늘의 성구</h3>
                {todayBibleVerses.length > 0 ? (
                    <ul className="space-y-4">
                        {todayBibleVerses.map((verse) => (
                            <li key={verse.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-md">
                                <div>
                                    <p className="font-semibold text-gray-800">
                                        {verse.book_name} {verse.chapter_number}: {verse.verses}
                                    </p>
                                    <span className="text-sm text-gray-500">{new Date(verse.date_used).toLocaleDateString()}</span>
                                </div>
                                <button
                                    onClick={() => handleDeleteVerse(verse.id)}
                                    className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold"
                                >
                                    삭제
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">오늘의 성구가 없습니다.</p>
                )}
            </div>
        </div>
    );
}
