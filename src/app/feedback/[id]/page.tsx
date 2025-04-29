import FeedbackForm from '@/app/components/FeedbackForm';

interface FeedbackPageProps {
    params: { id: string };
}

export default function FeedbackPage({ params }: FeedbackPageProps) {
    return (
        <main className="p-4 min-h-screen bg-white">
            <h1 className="text-xl font-semibold mb-4">활동 피드백</h1>
            <FeedbackForm activityId={params.id} />
        </main>
    );
}
