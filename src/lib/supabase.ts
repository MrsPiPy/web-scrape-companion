import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create client even with empty strings - will fail gracefully at runtime
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

export const isSupabaseConfigured = () => {
  return Boolean(supabaseUrl && supabaseAnonKey);
};

export interface ScrapeJob {
  id: string;
  url: string;
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
}

export interface ScrapeResult {
  id: string;
  job_id: string;
  summary: string;
  links: { url: string; text: string }[];
  images: { src: string; alt: string }[];
  headers: { level: number; text: string }[];
  resources: { type: string; url: string }[];
  created_at: string;
}

export interface ScrapeResponse {
  job_id: string;
  summary: string;
  links: { url: string; text: string }[];
  images: { src: string; alt: string }[];
  headers: { level: number; text: string }[];
  resources: { type: string; url: string }[];
}
