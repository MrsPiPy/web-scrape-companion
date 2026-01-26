import { Globe, ArrowUp } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-primary/10 rounded-full blur-2xl" />
        <div className="relative p-6 rounded-2xl bg-card border border-border">
          <Globe className="h-12 w-12 text-muted-foreground" />
        </div>
      </div>
      
      <h3 className="text-xl font-semibold mb-2">Ready to scrape</h3>
      <p className="text-muted-foreground text-sm mb-6 max-w-md">
        Enter a URL above to extract content, links, images, and more from any webpage.
      </p>
      
      <div className="flex items-center gap-2 text-primary text-sm">
        <ArrowUp className="h-4 w-4 animate-bounce" />
        <span>Start by entering a URL</span>
      </div>
    </div>
  );
}
