import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from './database.types';

export const supabase = createClientComponentClient<Database>();

export type Event = Database['public']['Tables']['events']['Row'];
export type NewEvent = Database['public']['Tables']['events']['Insert'];

export async function createEvent(eventData: Omit<NewEvent, 'creator_id'>) {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User must be logged in to create an event');
  }

  const { data, error } = await supabase
    .from('events')
    .insert([
      {
        ...eventData,
        creator_id: user.id,
        created_at: new Date().toISOString(),
      }
    ])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function getEvents() {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data;
}

export async function getEventById(id: number) {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw error;
  }

  return data;
} 