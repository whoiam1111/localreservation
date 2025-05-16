// src/app/api/verses/route.ts
import { supabase } from '../../lib/supabase'; // 이제 createClient가 아니라 supabase 인스턴스를 가져옵니다.
import { NextResponse } from 'next/server';

export async function GET() {
  // Supabase를 통해 데이터 조회 등의 작업을 진행
  const { data, error } = await supabase
    .from('today_bible_verses')
    .select('*');

  if (error) {
    return new NextResponse('Error retrieving data', { status: 500 });
  }

  return NextResponse.json(data);
}
