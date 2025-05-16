// lib/supabase-server.ts
import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '../lib/type';  // Database 타입 import

export function createClient() {
  return createServerComponentClient<Database>({ cookies });
}
