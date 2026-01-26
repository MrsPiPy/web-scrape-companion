import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured, ScrapeJob, ScrapeResponse } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

const SCRAPE_API_URL = 'https://womcxbappudoglbtmnzu.supabase.co/functions/v1/scrape';

export function useScraper() {
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<ScrapeJob[]>([]);
  const [currentResult, setCurrentResult] = useState<ScrapeResponse | null>(null);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch history from Supabase
  const fetchHistory = useCallback(async () => {
    if (!supabase || !isSupabaseConfigured) {
      console.log('Supabase not configured - history disabled');
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('scrape_jobs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setHistory(data || []);
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  // Scrape a URL
  const scrape = async (url: string) => {
    setIsLoading(true);
    setCurrentResult(null);
    setSelectedJobId(null);

    try {
      const response = await fetch(SCRAPE_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Request failed with status ${response.status}`);
      }

      const data: ScrapeResponse = await response.json();
      setCurrentResult(data);
      setSelectedJobId(data.job_id);
      
      toast({
        title: 'Scrape complete',
        description: 'Successfully extracted content from the page.',
      });

      // Refresh history
      await fetchHistory();
    } catch (error) {
      console.error('Error scraping:', error);
      toast({
        title: 'Scrape failed',
        description: error instanceof Error ? error.message : 'Failed to scrape the URL',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Load a historical result
  const loadResult = async (job: ScrapeJob) => {
    if (!supabase) {
      toast({
        title: 'Not available',
        description: 'History feature requires Supabase configuration.',
        variant: 'destructive',
      });
      return;
    }
    
    setSelectedJobId(job.id);
    
    try {
      const { data, error } = await supabase
        .from('scrape_results')
        .select('*')
        .eq('job_id', job.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setCurrentResult({
          job_id: data.job_id,
          summary: data.summary,
          links: data.links,
          images: data.images,
          headers: data.headers,
          resources: data.resources,
        });
      } else {
        toast({
          title: 'No results found',
          description: 'This scrape job has no associated results.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error loading result:', error);
      toast({
        title: 'Error loading result',
        description: 'Failed to load the scrape result.',
        variant: 'destructive',
      });
    }
  };

  // Delete a job from history
  const deleteJob = async (id: string) => {
    if (!supabase) return;
    
    try {
      // Delete results first due to foreign key
      await supabase.from('scrape_results').delete().eq('job_id', id);
      
      const { error } = await supabase.from('scrape_jobs').delete().eq('id', id);
      if (error) throw error;

      setHistory((prev) => prev.filter((job) => job.id !== id));
      
      if (selectedJobId === id) {
        setCurrentResult(null);
        setSelectedJobId(null);
      }

      toast({
        title: 'Deleted',
        description: 'Scrape job removed from history.',
      });
    } catch (error) {
      console.error('Error deleting job:', error);
      toast({
        title: 'Delete failed',
        description: 'Failed to delete the scrape job.',
        variant: 'destructive',
      });
    }
  };

  return {
    isLoading,
    history,
    currentResult,
    selectedJobId,
    scrape,
    loadResult,
    deleteJob,
  };
}
