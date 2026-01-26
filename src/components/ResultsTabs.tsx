import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sparkles, Link, Image, Heading1, Folder } from 'lucide-react';
import { SummaryTab } from './results/SummaryTab';
import { LinksTab } from './results/LinksTab';
import { ImagesTab } from './results/ImagesTab';
import { HeadersTab } from './results/HeadersTab';
import { ResourcesTab } from './results/ResourcesTab';
import { ExportButtons } from './ExportButtons';
import { ScrapeResponse } from '@/lib/supabase';

interface ResultsTabsProps {
  results: ScrapeResponse;
}

export function ResultsTabs({ results }: ResultsTabsProps) {
  const tabs = [
    { id: 'summary', label: 'Summary', icon: Sparkles, count: results.summary ? 1 : 0 },
    { id: 'links', label: 'Links', icon: Link, count: results.links?.length || 0 },
    { id: 'images', label: 'Images', icon: Image, count: results.images?.length || 0 },
    { id: 'headers', label: 'Headers', icon: Heading1, count: results.headers?.length || 0 },
    { id: 'resources', label: 'Resources', icon: Folder, count: results.resources?.length || 0 },
  ];

  return (
    <Tabs defaultValue="summary" className="w-full animate-fade-in">
      <div className="flex items-center justify-between gap-4 flex-wrap mb-4">
        <TabsList className="justify-start bg-secondary/50 border border-border rounded-lg p-1 h-auto flex-wrap gap-1">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4 py-2 rounded-md"
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span className="text-xs bg-background/20 px-1.5 py-0.5 rounded-full">
                  {tab.count}
                </span>
              )}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      <ScrollArea className="h-[calc(100vh-340px)]">
        <TabsContent value="summary" className="m-0">
          <SummaryTab summary={results.summary} />
        </TabsContent>
        
        <TabsContent value="links" className="m-0">
          <LinksTab links={results.links} />
        </TabsContent>
        
        <TabsContent value="images" className="m-0">
          <ImagesTab images={results.images} />
        </TabsContent>
        
        <TabsContent value="headers" className="m-0">
          <HeadersTab headers={results.headers} />
        </TabsContent>
        
        <TabsContent value="resources" className="m-0">
          <ResourcesTab resources={results.resources} />
        </TabsContent>
      </ScrollArea>
    </Tabs>
  );
}
