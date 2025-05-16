'use client';

import { useCallback, useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// Verse 타입 정의
type Verse = {
    id: number;
    book_name: string;
    chapter: number;
    verse: string;
    text: string;
    card_type: string;
};

export default function AdminPage() {
    const supabase = createClientComponentClient();

    const [verses, setVerses] = useState<Verse[]>([]);
    const [filteredType, setFilteredType] = useState<string>('전체');

    const [newBookName, setNewBookName] = useState('');
    const [newChapter, setNewChapter] = useState<number>(1);
    const [newVerse, setNewVerse] = useState('');
    const [newText, setNewText] = useState('');
    const [newCardType, setNewCardType] = useState('용기');

    const CARD_TYPES = ['용기', '전도', '소망'];

    // useCallback으로 fetchVerses 정의
    const fetchVerses = useCallback(async () => {
        const { data, error } = await supabase.from('today_bible_verses').select('*').order('id', { ascending: false });

        if (error) {
            console.error('성구 불러오기 오류:', error);
        } else {
            setVerses(data || []);
        }
    }, [supabase]);

    useEffect(() => {
        fetchVerses();
    }, [fetchVerses]);

    const handleAddVerse = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newBookName || !newChapter || !newVerse || !newText || !newCardType) {
            alert('모든 항목을 입력해주세요.');
            return;
        }

        const { error } = await supabase.from('today_bible_verses').insert([
            {
                book_name: newBookName,
                chapter: newChapter,
                verse: newVerse,
                text: newText,
                card_type: newCardType,
            },
        ]);

        if (error) {
            console.error('추가 실패:', error);
            alert('성구 추가 중 오류가 발생했습니다.');
        } else {
            alert('성구가 추가되었습니다.');
            setNewBookName('');
            setNewChapter(1);
            setNewVerse('');
            setNewText('');
            setNewCardType('용기');
            fetchVerses();
        }
    };

    const handleDeleteVerse = async (id: number) => {
        const confirmed = confirm('이 성구를 삭제하시겠습니까?');
        if (!confirmed) return;

        const { error } = await supabase.from('today_bible_verses').delete().eq('id', id);
        if (error) {
            console.error('삭제 실패:', error);
            alert('성구 삭제 중 오류가 발생했습니다.');
        } else {
            alert('성구가 삭제되었습니다.');
            fetchVerses();
        }
    };

    const filteredVerses = filteredType === '전체' ? verses : verses.filter((v) => v.card_type === filteredType);

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <h1 className="text-2xl font-bold mb-6">📖 성구 관리</h1>

            {/* 성구 추가 폼 */}
            <form onSubmit={handleAddVerse} className="space-y-3 mb-10 bg-white p-6 rounded shadow-md">
                <h2 className="text-xl font-semibold mb-2">➕ 성구 추가</h2>
                <input
                    type="text"
                    placeholder="제목 (ex. 요한복음)"
                    value={newBookName}
                    onChange={(e) => setNewBookName(e.target.value)}
                    className="w-full p-2 border rounded"
                />
                <input
                    type="number"
                    placeholder="장"
                    value={newChapter}
                    onChange={(e) => setNewChapter(Number(e.target.value))}
                    className="w-full p-2 border rounded"
                />
                <input
                    type="text"
                    placeholder="절 (ex. 4~5)"
                    value={newVerse}
                    onChange={(e) => setNewVerse(e.target.value)}
                    className="w-full p-2 border rounded"
                />
                <textarea
                    placeholder="본문 내용"
                    value={newText}
                    onChange={(e) => setNewText(e.target.value)}
                    className="w-full p-2 border rounded"
                />
                <select
                    value={newCardType}
                    onChange={(e) => setNewCardType(e.target.value)}
                    className="w-full p-2 border rounded"
                >
                    {CARD_TYPES.map((type) => (
                        <option key={type} value={type}>
                            {type}
                        </option>
                    ))}
                </select>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    추가
                </button>
            </form>

            {/* 타입 필터 */}
            <div className="mb-6">
                <label className="font-medium mr-3">🧾 카드 타입별 보기:</label>
                <select
                    value={filteredType}
                    onChange={(e) => setFilteredType(e.target.value)}
                    className="p-2 border rounded"
                >
                    <option value="전체">전체</option>
                    {CARD_TYPES.map((type) => (
                        <option key={type} value={type}>
                            {type}
                        </option>
                    ))}
                </select>
            </div>

            {/* 성구 목록 */}
            <h2 className="text-xl font-semibold mb-4">📚 등록된 성구 목록</h2>
            {filteredVerses.length === 0 ? (
                <p className="text-gray-500">해당 타입의 성구가 없습니다.</p>
            ) : (
                <ul className="space-y-3">
                    {filteredVerses.map((verse) => (
                        <li key={verse.id} className="p-4 bg-white shadow rounded flex justify-between items-start">
                            <div className="w-5/6">
                                <p className="font-medium">
                                    {verse.book_name} {verse.chapter}:{verse.verse}
                                </p>
                                <p className="text-gray-700">{verse.text}</p>
                                <p className="text-sm text-blue-500 mt-1">카드 타입: {verse.card_type}</p>
                            </div>
                            <button
                                onClick={() => handleDeleteVerse(verse.id)}
                                className="text-red-500 hover:underline"
                            >
                                삭제
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
