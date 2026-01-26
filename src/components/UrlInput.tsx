import { useState } from 'react';
import { Search, Globe, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface UrlInputProps {
  onScrape: (url: string) => void;
  isLoading: boolean;
}

export function UrlInput({ onScrape, isLoading }: UrlInputProps) {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onScrape(url.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
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
  );
}
