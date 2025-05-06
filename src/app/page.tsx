'use client';

import Calendar from './components/Calendar';
import AddButton from './components/AddButton';

export default function HomePage() {
    return (
        <main className="p-4 relative min-h-screen bg-white">
            <Calendar />
            <AddButton />
        </main>
    );
}
