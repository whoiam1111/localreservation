import Calendar from './components/Calendar';
import AddButton from './components/AddButton';

export default function HomePage() {
    return (
        <main className="p-4 relative min-h-screen bg-white">
            <h1 className="text-xl font-semibold mb-4">이번 달 좌판 활동</h1>
            <Calendar />
            <AddButton />
        </main>
    );
}
