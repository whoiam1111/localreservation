import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get('date');

    if (!date) {
        return NextResponse.json({ error: '날짜가 필요합니다.' }, { status: 400 });
    }

    try {
        const { data, error } = await supabase.from('today_bible_verses').select('*').eq('date_used', date).single();

        if (error) {
            throw error;
        }

        if (!data) {
            return NextResponse.json({ error: '오늘의 성구가 없습니다.' }, { status: 404 });
        }

        // 성구 데이터 반환
        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error('성구를 가져오는 데 실패:', error); // 에러 로그 출력
        return NextResponse.json({ error: '성구를 가져오는 데 실패했습니다.' }, { status: 500 });
    }
}
