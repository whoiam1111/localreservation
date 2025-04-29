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
}

export async function POST(req: Request) {
    try {
        const body: ActivityBody = await req.json();
        const { location, startTime, endTime, tool } = body;

        if (!location || !startTime || !endTime) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        if (!isValidDate(startTime) || !isValidDate(endTime)) {
            return NextResponse.json({ error: 'Invalid date format' }, { status: 400 });
        }

        const { data, error } = await supabase.from('activities').insert([
            {
                location,
                start_time: new Date(startTime).toISOString(),
                end_time: new Date(endTime).toISOString(),
                tool,
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
