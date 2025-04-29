import { supabase } from '@/app/lib/supabase';
import { NextResponse } from 'next/server';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    const id = params.id;
    const body = await req.json();
    const { result, feedback } = body;

    const { data, error } = await supabase.from('activities').update({ result, feedback }).eq('id', id);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, activity: data });
}
