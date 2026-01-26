import { UrlInput } from '@/components/UrlInput';
import { HistorySidebar } from '@/components/HistorySidebar';
import { ResultsTabs } from '@/components/ResultsTabs';
import { LoadingState } from '@/components/LoadingState';
import { EmptyState } from '@/components/EmptyState';
import { useScraper } from '@/hooks/useScraper';
import { Globe, Share2, Link, FileSpreadsheet, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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

  const handleCopyLink = async () => {
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

  const handleExportToSheets = () => {
    if (!currentResult) {
      toast({
        title: 'No data to export',
        description: 'Scrape a URL first to export results.',
        variant: 'destructive',
      });
      return;
    }

    // Build CSV content from scrape results
    const rows: string[][] = [];
    
    // Add links
    if (currentResult.links?.length) {
      rows.push(['Type', 'Text', 'URL']);
      currentResult.links.forEach(link => {
        rows.push(['Link', link.text || '', link.url || '']);
      });
      rows.push([]); // Empty row separator
    }

    // Add images
    if (currentResult.images?.length) {
      rows.push(['Type', 'Alt Text', 'Source URL']);
      currentResult.images.forEach(img => {
        rows.push(['Image', img.alt || '', img.src || '']);
      });
      rows.push([]);
    }

    // Add headers
    if (currentResult.headers?.length) {
      rows.push(['Header Level', 'Text']);
      currentResult.headers.forEach(header => {
        rows.push([`H${header.level}`, header.text]);
      });
      rows.push([]);
    }

    // Add resources
    if (currentResult.resources?.length) {
      rows.push(['Resource Type', 'URL']);
      currentResult.resources.forEach(resource => {
        rows.push([resource.type, resource.url]);
      });
    }

    // Convert to CSV
    const csvContent = rows
      .map(row => row.map(cell => `"${(cell || '').replace(/"/g, '""')}"`).join(','))
      .join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `scrape-results-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: 'CSV downloaded',
      description: 'Open the file in Google Sheets to import your data.',
    });
  };

  const handleExportImages = () => {
    if (!currentResult?.images?.length) {
      toast({
        title: 'No images to export',
        description: 'Scrape a URL with images first.',
        variant: 'destructive',
      });
      return;
    }

    // Build CSV with image data
    const rows: string[][] = [['Alt Text', 'Source URL']];
    currentResult.images.forEach(img => {
      rows.push([img.alt || '', img.src || '']);
    });

    const csvContent = rows
      .map(row => row.map(cell => `"${(cell || '').replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `images-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: 'Images exported',
      description: `Exported ${currentResult.images.length} image URLs.`,
    });
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleCopyLink}>
                    <Link className="h-4 w-4 mr-2" />
                    Copy link
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleExportToSheets}>
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    Export to Google Sheets
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleExportImages}>
                    <Image className="h-4 w-4 mr-2" />
                    Export Images
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
