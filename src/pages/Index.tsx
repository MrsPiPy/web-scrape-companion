import { UrlInput } from '@/components/UrlInput';
import { HistorySidebar } from '@/components/HistorySidebar';
import { ResultsTabs } from '@/components/ResultsTabs';
import { LoadingState } from '@/components/LoadingState';
import { EmptyState } from '@/components/EmptyState';
import { useScraper } from '@/hooks/useScraper';
import { Globe, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { toast } = useToast();
  const {
    isLoading,
    history,
    currentResult,
    selectedJobId,
    scrape,
    loadResult,
    deleteJob,
  } = useScraper();

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast({
        title: 'Link copied',
        description: 'URL copied to clipboard.',
      });
    } catch {
      toast({
        title: 'Failed to copy',
        description: 'Could not copy URL to clipboard.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="flex h-screen bg-background">
      {/* History Sidebar */}
      <HistorySidebar
        history={history}
        onSelect={loadResult}
        onDelete={deleteJob}
        selectedId={selectedJobId || undefined}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <Globe className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gradient">Web Scraper</h1>
                  <p className="text-sm text-muted-foreground">Extract content, links, and structure from any webpage</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
            
            <UrlInput onScrape={scrape} isLoading={isLoading} />
          </div>
        </header>

        {/* Results Area */}
        <main className="flex-1 overflow-hidden p-6">
          {isLoading ? (
            <LoadingState />
          ) : currentResult ? (
            <ResultsTabs results={currentResult} />
          ) : (
            <EmptyState />
          )}
        </main>
      </div>
    </div>
  );
};

export default Index;
