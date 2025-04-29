import { supabase } from '@/app/lib/supabase';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';

interface ActivityDetailPageProps {
    params: { id: string };
}

export default async function ActivityDetailPage({ params }: ActivityDetailPageProps) {
    const { data: activity, error } = await supabase.from('activities').select('*').eq('id', params.id).single();

    if (error || !activity) return notFound();

    const handleDelete = async () => {
        'use server';
        await supabase.from('activities').delete().eq('id', params.id);
        redirect('/');
    };

    return (
        <main className="p-4 bg-white min-h-screen">
            <h1 className="text-xl font-bold mb-4">활동 상세보기</h1>

            <div className="space-y-3 text-sm mb-6">
                <p>
                    📍 <b>장소:</b> {activity.location}
                </p>
                <p>
                    ⏰ <b>시간:</b> {activity.start_time} ~ {activity.end_time}
                </p>
                <p>
                    🛠️ <b>도구:</b> {activity.tool}
                </p>
                <p>
                    📅 <b>작성일:</b> {new Date(activity.created_at).toLocaleDateString()}
                </p>
                <p>
                    📊 <b>결과:</b> {activity.result || '미작성'}
                </p>
                <p>
                    💬 <b>피드백:</b> {activity.feedback || '미작성'}
                </p>
            </div>

            <form action={handleDelete}>
                <button type="submit" className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600">
                    삭제하기
                </button>
            </form>

            <Link href={`/activities/${params.id}/edit`} className="inline-block mt-2 text-blue-500 underline">
                ✏️ 수정하기
            </Link>
        </main>
    );
}
