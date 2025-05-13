import { supabase } from '@/app/lib/supabase';
import { NextResponse } from 'next/server';

function isValidDate(value: unknown): boolean {
    const date = new Date(value as string);
    return !isNaN(date.getTime());
}

interface ActivityBody {
    location: string;
    startTime: string;
    endTime: string;
    tool: string;
    region: string;
    date: string;
    host: string;
    hostNumber: string;
}

const formatTimeToHHMM = (dateStr: string): string => {
    const date = new Date(dateStr);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
};

export async function POST(req: Request) {
    try {
        const body: ActivityBody = await req.json();
        const { location, startTime, endTime, tool, region, date, host, hostNumber } = body;

        if (!location || !startTime || !endTime || !region || !date) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        if (!isValidDate(startTime) || !isValidDate(endTime) || !isValidDate(date)) {
            return NextResponse.json({ error: 'Invalid date format' }, { status: 400 });
        }

        // 시간 변환
        const formattedStartTime = formatTimeToHHMM(startTime); // HH:MM 형식
        const formattedEndTime = formatTimeToHHMM(endTime); // HH:MM 형식

        // Supabase에 데이터 삽입
        const { data, error } = await supabase.from('activities').insert([
            {
                region,
                location,
                start_time: formattedStartTime,
                end_time: formattedEndTime,
                date: new Date(date).toISOString().split('T')[0],
                tool,
                host,
                hostnumber: hostNumber,
            },
        ]);

        if (error) {
            console.error('Insert error:', error.message);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, activity: data }, { status: 201 });
    } catch (err: unknown) {
        console.error('Unexpected error:', err);
        return NextResponse.json({ error: 'Unexpected server error' }, { status: 500 });
    }
}

export async function GET() {
    try {
        const { data, error } = await supabase.from('activities').select('*').order('created_at', { ascending: true });

        if (error) {
            console.error('Fetch error:', error.message);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ activities: data }, { status: 200 });
    } catch (err: unknown) {
        console.error('Unexpected error:', err);
        return NextResponse.json({ error: 'Unexpected server error' }, { status: 500 });
    }
}
