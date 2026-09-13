import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zuaifdowomnbfeikqtjv.supabase.co';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_pDvTeukKFo5M8IP5VHUjwA_1Ls664hN';
  
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
