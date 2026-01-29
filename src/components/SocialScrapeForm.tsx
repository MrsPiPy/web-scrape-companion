import { useState } from 'react';
import { Search, Loader2, Hash, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { SocialPlatform } from '@/hooks/useSocialScraper';

interface SocialScrapeFormProps {
  onScrape: (platform: SocialPlatform, keywords: string[], maxResults: number) => void;
  isLoading: boolean;
}

const platformOptions = [
  { value: 'tiktok' as const, label: 'TikTok Hashtags' },
  { value: 'youtube' as const, label: 'YouTube Shorts' },
  { value: 'instagram' as const, label: 'Instagram Posts & Reels' },
];

export function SocialScrapeForm({ onScrape, isLoading }: SocialScrapeFormProps) {
  const [platform, setPlatform] = useState<SocialPlatform>('tiktok');
  const [keywordInput, setKeywordInput] = useState('');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [maxResults, setMaxResults] = useState(20);

  const addKeyword = () => {
    const trimmed = keywordInput.trim().replace(/^#/, '');
    if (trimmed && !keywords.includes(trimmed)) {
      setKeywords([...keywords, trimmed]);
      setKeywordInput('');
    }
  };

  const removeKeyword = (kw: string) => {
    setKeywords(keywords.filter((k) => k !== kw));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addKeyword();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (keywords.length > 0) {
      onScrape(platform, keywords, maxResults);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center gap-3">
        <Select value={platform} onValueChange={(v) => setPlatform(v as SocialPlatform)}>
          <SelectTrigger className="w-[220px] h-12 bg-card border-border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {platformOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="relative flex-1">
          <Hash className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Type a keyword or hashtag and press Enter"
            value={keywordInput}
            onChange={(e) => setKeywordInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="h-12 pl-10 pr-4 font-mono text-sm bg-card border-border"
            disabled={isLoading}
          />
        </div>

        <Input
          type="number"
          min={1}
          max={100}
          value={maxResults}
          onChange={(e) => setMaxResults(Number(e.target.value))}
          className="w-[90px] h-12 bg-card border-border text-center"
          disabled={isLoading}
          title="Max results"
        />

        <Button
          type="submit"
          size="lg"
          variant="glow"
          disabled={isLoading || keywords.length === 0}
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

      {keywords.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {keywords.map((kw) => (
            <Badge key={kw} variant="secondary" className="gap-1 px-3 py-1 text-sm">
              #{kw}
              <button
                type="button"
                onClick={() => removeKeyword(kw)}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </form>
  );
}
