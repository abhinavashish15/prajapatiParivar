import { createClient } from '@supabase/supabase-js';
import { MemberProfile, UserRole } from '../types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-project.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Get the currently logged-in user (session check)
 */
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) return null;
  return user;
}

/**
 * Fetch a user's role from the database
 */
export async function getUserRole(userId: string): Promise<UserRole> {
  try {
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('id', userId)
      .single();

    if (error || !data) return 'guest';
    return data.role as UserRole;
  } catch {
    return 'guest';
  }
}

/**
 * Fetch a user's member profile details
 */
export async function getUserProfile(userId: string): Promise<MemberProfile | null> {
  try {
    const { data, error } = await supabase
      .from('member_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !data) return null;
    return data as MemberProfile;
  } catch {
    return null;
  }
}
