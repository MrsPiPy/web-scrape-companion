import { useState } from 'react';
import { Clock, Trash2, Globe, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ScrapeJob } from '@/lib/supabase';
import { cn } from '@/lib/utils';

interface HistorySidebarProps {
  history: ScrapeJob[];
  onSelect: (job: ScrapeJob) => void;
  onDelete: (id: string) => void;
  selectedId?: string;
}

export function HistorySidebar({ history, onSelect, onDelete, selectedId }: HistorySidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname + (urlObj.pathname !== '/' ? urlObj.pathname : '');
    } catch {
      return url;
    }
  };

  return (
    <div
      className={cn(
        "h-full border-r border-border bg-sidebar transition-all duration-300 flex flex-col",
        collapsed ? "w-16" : "w-72"
      )}
    >
      <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-sidebar-primary" />
            <h2 className="font-semibold text-sm">History</h2>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8 text-sidebar-foreground hover:bg-sidebar-accent ml-auto"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <ScrollArea className="flex-1">
        {history.length === 0 ? (
          <div className={cn("p-4 text-center", collapsed && "hidden")}>
            <p className="text-xs text-muted-foreground">No scrapes yet</p>
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {history.map((job) => (
              <div
                key={job.id}
                className={cn(
                  "group rounded-lg transition-colors cursor-pointer",
                  selectedId === job.id
                    ? "bg-sidebar-accent border border-sidebar-primary/30"
                    : "hover:bg-sidebar-accent border border-transparent"
                )}
                onClick={() => onSelect(job)}
              >
                <div className={cn("p-3", collapsed && "p-2 flex justify-center")}>
                  {collapsed ? (
                    <Globe className="h-4 w-4 text-sidebar-foreground" />
                  ) : (
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate text-sidebar-foreground">
                          {formatUrl(job.url)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDate(job.created_at)}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(job.id);
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
