'use client';

import { useRouter } from 'next/navigation';

interface AddButtonProps {
    label?: string;
    icon?: React.ReactNode;
    href: string;
    className?: string;
}

export default function AddButton({ label, icon, href, className }: AddButtonProps) {
    const router = useRouter();

    return (
        <button
            onClick={() => router.push(href)}
            className={`flex items-center justify-center gap-2 w-full sm:w-fit px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white text-sm sm:text-base rounded-xl shadow-md hover:shadow-lg transition-all duration-200 mt-2 ${className}`}
        >
            {icon && <span>{icon}</span>}
            {label && <span>{label}</span>}
        </button>
    );
}
