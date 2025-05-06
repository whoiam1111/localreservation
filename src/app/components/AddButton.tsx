'use client';

import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';

export default function AddButton() {
    const router = useRouter();

    return (
        <button
            onClick={() => router.push('/add')}
            className="flex items-center justify-center gap-2 w-full sm:w-fit px-5 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white text-base sm:text-lg font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
        >
            <Plus className="w-5 h-5 sm:w-6 sm:h-6" />
            <span>일정 추가</span>
        </button>
    );
}
