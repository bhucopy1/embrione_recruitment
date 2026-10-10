import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL or Anon Key is missing. Check your .env.local file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Member {
  id?: string;
  name: string;
  domain: string;
  position: string;
  srn: string;
  email: string;
  linkedin_url?: string | null;
  github_url?: string | null;
  branch: string;
  semester: number;
  bio?: string | null;
  photo_url: string;
  status?: 'pending' | 'approved' | 'rejected';
  created_at?: string;
}
