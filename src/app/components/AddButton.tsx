'use client';

import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';

export default function AddButton() {
    const router = useRouter();

    return (
        <button
            onClick={() => router.push('/add')}
            className="fixed z-100 bottom-6 right-6 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition"
        >
            <Plus size={24} />
        </button>
    );
}
