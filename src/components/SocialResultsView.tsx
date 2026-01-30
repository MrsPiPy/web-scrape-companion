import { ExternalLink, Heart, Eye, MessageCircle, Share2, Download } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { SocialScrapeResponse, SocialResult } from '@/hooks/useSocialScraper';

interface SocialResultsViewProps {
  data: SocialScrapeResponse;
}

function formatNumber(n: unknown): string {
  const num = Number(n);
  if (!num && num !== 0) return '-';
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return String(num);
}

function getDisplayText(item: SocialResult): string {
  return item.title || item.description || item.caption || '';
}

function ResultCard({ item }: { item: SocialResult }) {
  const text = getDisplayText(item);
  const imageSource = item.imageUrl || item.thumbnail;

  return (
    <Card className="overflow-hidden border-border bg-card hover:border-primary/30 transition-colors">
      <CardContent className="p-4">
        <div className="flex gap-4">
          {imageSource && (
            <div className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden bg-muted">
              <img
                src={imageSource}
                alt=""
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}

          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                {text && (
                  <p className="text-sm text-foreground line-clamp-2">{text}</p>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  @{item.author || 'unknown'}
                </p>
              </div>
              {item.url && (
                <a
                  href={item.url as string}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 text-muted-foreground hover:text-primary"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>

            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Eye className="h-3 w-3" /> {formatNumber(item.views)}
              </span>
              <span className="flex items-center gap-1">
                <Heart className="h-3 w-3" /> {formatNumber(item.likes)}
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle className="h-3 w-3" /> {formatNumber(item.comments)}
              </span>
              {item.shares != null && (
                <span className="flex items-center gap-1">
                  <Share2 className="h-3 w-3" /> {formatNumber(item.shares)}
                </span>
              )}
            </div>

            {item.hashtags && Array.isArray(item.hashtags) && item.hashtags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {(item.hashtags as string[]).slice(0, 5).map((tag: string, i: number) => (
                  <Badge key={i} variant="outline" className="text-[10px] px-1.5 py-0">
                    #{typeof tag === 'object' ? (tag as { name?: string }).name || '' : tag}
                  </Badge>
                ))}
                {item.hashtags.length > 5 && (
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                    +{item.hashtags.length - 5}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function SocialResultsView({ data }: SocialResultsViewProps) {
  const { toast } = useToast();

  const handleExportCSV = () => {
    const rows: string[][] = [
      ['Platform', 'URL', 'Author', 'Text', 'Views', 'Likes', 'Comments', 'Hashtags'],
    ];

    data.results.forEach((item) => {
      rows.push([
        item.platform,
        String(item.url || ''),
        String(item.author || ''),
        getDisplayText(item).replace(/"/g, '""'),
        String(item.views ?? ''),
        String(item.likes ?? ''),
        String(item.comments ?? ''),
        Array.isArray(item.hashtags)
          ? item.hashtags.map((t: unknown) => (typeof t === 'object' ? (t as { name?: string }).name : t)).join('; ')
          : '',
      ]);
    });

    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `social-${data.platform}-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({ title: 'CSV downloaded', description: `Exported ${data.results.length} results.` });
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold capitalize">{data.platform} Results</h3>
          <p className="text-sm text-muted-foreground">
            {data.count} results for: {data.keywords.map((k) => k.startsWith('@') ? k : `#${k}`).join(', ')}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleExportCSV}>
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      <ScrollArea className="h-[calc(100vh-380px)]">
        <div className="grid gap-3">
          {data.results.map((item, i) => (
            <ResultCard key={item.id || i} item={item} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
