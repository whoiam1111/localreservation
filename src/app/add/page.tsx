import ActivityForm from '../components/ActivityForm';

export default function AddActivityPage() {
    return (
        <main className="p-4 bg-white min-h-screen">
            <h1 className="text-xl font-semibold mb-4">좌판 활동 추가</h1>
            <ActivityForm />
        </main>
    );
}
