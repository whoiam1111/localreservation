'use server';

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';

// HH:MM 형식으로 시간을 포맷하는 함수
const formatTimeToHHMM = (dateStr: string): string => {
    const date = new Date(dateStr);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
};

// GET: 활동 정보 조회
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    if (!id) {
        return NextResponse.json({ error: '활동 ID가 필요합니다.' }, { status: 400 });
    }

    const { data, error } = await supabase.from('activities').select('*').eq('id', id).single();

    if (error || !data) {
        return NextResponse.json({ error: error?.message || '활동을 찾을 수 없습니다.' }, { status: 404 });
    }

    return NextResponse.json({ activity: data });
}

// PUT: 활동 정보 수정
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const { result, feedback, participant_count, start_time, end_time, host, host_number, isHostUnspecified } =
        await req.json();

    if (!id || result === undefined || feedback === undefined || participant_count === undefined) {
        return NextResponse.json({ error: '필수 값이 누락되었습니다.' }, { status: 400 });
    }

    // 주관자 미정 처리
    const finalHost = isHostUnspecified ? '미정' : host;
    const finalHostNumber = finalHost === '미정' ? null : host_number;

    // HH:MM 형식으로 시간 변환
    const formattedStartTime = start_time ? formatTimeToHHMM(start_time) : undefined;
    const formattedEndTime = end_time ? formatTimeToHHMM(end_time) : undefined;

    const { data, error } = await supabase
        .from('activities')
        .update({
            result,
            feedback,
            participant_count,
            start_time: formattedStartTime,
            end_time: formattedEndTime,
            host: finalHost,
            hostnumber: finalHostNumber,
        })
        .eq('id', id)
        .select('*')
        .maybeSingle();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
        return NextResponse.json({ error: '해당 활동을 찾을 수 없습니다.' }, { status: 404 });
    }

    return NextResponse.json({ activity: data });
}

// DELETE: 활동 정보 삭제
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    if (!id) {
        return NextResponse.json({ error: '활동 ID가 필요합니다.' }, { status: 400 });
    }

    const { error } = await supabase.from('activities').delete().eq('id', id);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}
