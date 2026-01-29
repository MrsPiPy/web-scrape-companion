import { useState } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export type SocialPlatform = 'tiktok' | 'youtube' | 'instagram';

export interface SocialResult {
  platform: string;
  id: string;
  url: string;
  title?: string;
  description?: string;
  caption?: string;
  author: string;
  likes: number;
  views: number;
  comments: number;
  shares?: number;
  hashtags?: string[];
  thumbnail?: string;
  imageUrl?: string;
  type?: string;
  createdAt?: string;
  publishedAt?: string;
  timestamp?: string;
}

export interface SocialScrapeResponse {
  platform: SocialPlatform;
  keywords: string[];
  count: number;
  results: SocialResult[];
}

export function useSocialScraper() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SocialScrapeResponse | null>(null);
  const { toast } = useToast();

  const scrape = async (platform: SocialPlatform, keywords: string[], maxResults = 20) => {
    setIsLoading(true);
    setResults(null);

    try {
      if (!supabase || !isSupabaseConfigured) {
        throw new Error('Supabase is not configured');
      }

      const { data, error } = await supabase.functions.invoke('social-scrape', {
        body: { platform, keywords, maxResults },
      });

      if (error) throw new Error(error.message || 'Social scrape failed');
      if (!data.success) throw new Error(data.error || 'Social scrape failed');

      setResults(data as SocialScrapeResponse);

      toast({
        title: 'Scrape complete',
        description: `Found ${data.count} results from ${platform}.`,
      });
    } catch (error) {
      console.error('Social scrape error:', error);
      toast({
        title: 'Social scrape failed',
        description: error instanceof Error ? error.message : 'Failed to scrape social media',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clear = () => setResults(null);

  return { isLoading, results, scrape, clear };
}
