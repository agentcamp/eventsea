import { createClient } from '@supabase/supabase-js';

if (!process.env.SUPABASE_URL) {
  throw new Error('Missing SUPABASE_URL environment variable');
}

if (!process.env.SUPABASE_SERVICE_ROLE_SECRET) {
  throw new Error('Missing SUPABASE_SERVICE_ROLE_SECRET environment variable');
}

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_SECRET;

export const supabase = createClient(supabaseUrl, supabaseKey);

export const signInWithGitHub = async (redirectTo?: string) => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_ORIGIN}/auth/callback${redirectTo ? `?next=${redirectTo}` : ''}`
    }
  });

  if (error) throw error;
  return data;
};

export const getSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) throw error;
  return session;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}; 