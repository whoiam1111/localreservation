'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const navItems = [
        { label: '대시보드', path: '/admin' },
        { label: '성구관리', path: '/admin/manage-verse' },
        { label: '활동관리', path: '/admin/manage-activities' },
    ];

    return (
        <main className="relative min-h-screen bg-gray-100 flex overflow-hidden">
            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 w-40 h-full bg-gray-800 text-white p-4 z-40 transition-transform duration-300 transform ${
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                } md:translate-x-0`}
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">관리자 대시보드</h2>
                    <X className="md:hidden text-white cursor-pointer" onClick={() => setIsSidebarOpen(false)} />
                </div>
                <nav>
                    <ul className="space-y-2">
                        {navItems.map(({ label, path }) => (
                            <li key={path}>
                                <button
                                    onClick={() => {
                                        router.push(path);
                                        setIsSidebarOpen(false); // 모바일에서 닫기
                                    }}
                                    className={`block w-full text-left py-2 px-4 rounded transition-colors ${
                                        pathname === path ? 'bg-gray-700 font-semibold' : 'hover:bg-gray-700'
                                    }`}
                                >
                                    {label}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
            </aside>

            {/* Toggle button for mobile */}
            <button
                className="md:hidden fixed top-4 left-4 z-50 text-gray-800 bg-white p-2 rounded-full shadow"
                onClick={() => setIsSidebarOpen(true)}
                aria-label="사이드바 열기"
            >
                <Menu size={28} />
            </button>

            {/* Content */}
            <div className="flex-1 ml-0 md:ml-64 p-4">{children}</div>
        </main>
    );
}
