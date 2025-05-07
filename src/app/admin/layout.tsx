// app/admin/layout.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, X } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <main className="relative min-h-screen bg-white flex">
            {/* 사이드바 */}
            <div
                className={`fixed top-0 left-0 w-64 h-full bg-gray-800 text-white p-4 transition-transform duration-300 transform ${
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                } md:translate-x-0`}
            >
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold">관리자 대시보드</h2>
                    <X className="text-white cursor-pointer" onClick={() => setIsSidebarOpen(false)} />
                </div>
                <nav className="mt-6">
                    <ul>
                        <li>
                            <button
                                onClick={() => router.push('/admin')}
                                className="text-white hover:bg-gray-700 block py-2 px-4 rounded"
                            >
                                대시보드
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => router.push('/admin/manage-verse')}
                                className="text-white hover:bg-gray-700 block py-2 px-4 rounded"
                            >
                                오늘의 성구 관리
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => router.push('/admin/manage-activities')}
                                className="text-white hover:bg-gray-700 block py-2 px-4 rounded"
                            >
                                활동 관리
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>

            {/* 모바일 사이드바 토글 버튼 */}
            <button className="md:hidden absolute top-4 left-4 text-white" onClick={() => setIsSidebarOpen(true)}>
                <Menu size={32} />
            </button>

            {/* 메인 콘텐츠 */}
            <div className="ml-0 md:ml-64 w-full p-4">{children}</div>
        </main>
    );
}
