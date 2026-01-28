import { useState } from 'react';
import { Search, Globe, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface UrlInputProps {
  onScrape: (url: string) => void;
  isLoading: boolean;
}

const socialPlatforms = [
  { 
    name: 'YouTube', 
    url: 'https://youtube.com', 
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
    color: 'hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30'
  },
  { 
    name: 'TikTok', 
    url: 'https://tiktok.com', 
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
      </svg>
    ),
    color: 'hover:bg-pink-500/10 hover:text-pink-500 hover:border-pink-500/30'
  },
  { 
    name: 'Instagram', 
    url: 'https://instagram.com', 
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
      </svg>
    ),
    color: 'hover:bg-purple-500/10 hover:text-purple-500 hover:border-purple-500/30'
  },
  { 
    name: 'X', 
    url: 'https://x.com', 
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
    color: 'hover:bg-foreground/10 hover:text-foreground hover:border-foreground/30'
  },
];

interface TrendingHashtag {
  tag: string;
  count: number;
}

export function UrlInput({ onScrape, isLoading }: UrlInputProps) {
  const [url, setUrl] = useState('');
  const [trendsOpen, setTrendsOpen] = useState(false);
  const [trendsLoading, setTrendsLoading] = useState(false);
  const [trendingHashtags, setTrendingHashtags] = useState<TrendingHashtag[]>([]);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onScrape(url.trim());
    }
  };

  const handleTikTokClick = async () => {
    setTrendsOpen(true);
    setTrendsLoading(true);

    try {
      if (!supabase) throw new Error('Not connected');

      const { data, error } = await supabase.functions.invoke('tiktok-trends');

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      setTrendingHashtags(data.hashtags || []);
      toast({
        title: 'TikTok Trends Loaded',
        description: `Found ${data.hashtags?.length || 0} trending hashtags from ${data.videoCount} videos`,
      });
    } catch (error) {
      console.error('Error fetching trends:', error);
      toast({
        title: 'Failed to load trends',
        description: error instanceof Error ? error.message : 'Could not fetch TikTok trends',
        variant: 'destructive',
      });
      setTrendsOpen(false);
    } finally {
      setTrendsLoading(false);
    }
  };

  const handleSocialClick = (platform: string) => {
    if (platform === 'TikTok') {
      handleTikTokClick();
    } else {
      toast({
        title: 'Not available',
        description: `${platform} cannot be scraped due to security restrictions.`,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="w-full space-y-3">
      <form onSubmit={handleSubmit}>
        <div className="relative flex items-center gap-3">
          <div className="relative flex-1">
            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="url"
              placeholder="Enter URL to scrape (e.g., https://example.com)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="h-12 pl-12 pr-4 font-mono text-sm bg-card border-border focus:border-primary focus:ring-primary/20 placeholder:text-muted-foreground/60"
              disabled={isLoading}
            />
          </div>
          <Button
            type="submit"
            size="lg"
            variant="glow"
            disabled={isLoading || !url.trim()}
            className="h-12 px-6 font-medium"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Scraping...
              </>
            ) : (
              <>
                <Search className="h-4 w-4" />
                Scrape
              </>
            )}
          </Button>
        </div>
      </form>

      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Quick scrape:</span>
        <TooltipProvider delayDuration={300}>
          <div className="flex gap-1.5">
            {socialPlatforms.map((platform) => (
              <Tooltip key={platform.name}>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className={`h-8 w-8 border-border/50 bg-card/50 transition-all ${platform.color}`}
                    onClick={() => handleSocialClick(platform.name)}
                    disabled={isLoading}
                  >
                    {platform.icon}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs">
                  {platform.name === 'TikTok' ? 'TikTok Trends' : `${platform.name} (unavailable)`}
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </TooltipProvider>
      </div>

      <Dialog open={trendsOpen} onOpenChange={setTrendsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-pink-500" fill="currentColor">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
              </svg>
              TikTok Trending Hashtags
            </DialogTitle>
          </DialogHeader>

          {trendsLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
              <span className="ml-3 text-muted-foreground">Fetching trends...</span>
            </div>
          ) : (
            <ScrollArea className="max-h-[400px] pr-4">
              <div className="flex flex-wrap gap-2">
                {trendingHashtags.map((item, index) => (
                  <Badge
                    key={item.tag}
                    variant="secondary"
                    className="cursor-pointer hover:bg-pink-500/20 hover:text-pink-500 transition-colors"
                    onClick={() => {
                      window.open(`https://www.tiktok.com/tag/${item.tag}`, '_blank');
                    }}
                  >
                    <span className="text-muted-foreground mr-1">#{index + 1}</span>
                    #{item.tag}
                    <span className="ml-1 text-xs text-muted-foreground">({item.count})</span>
                  </Badge>
                ))}
              </div>
              {trendingHashtags.length > 0 && (
                <p className="text-xs text-muted-foreground mt-4 text-center">
                  Click a hashtag to view on TikTok
                </p>
              )}
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
