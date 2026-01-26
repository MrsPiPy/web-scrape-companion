import { Download, FileJson, FileSpreadsheet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrapeResponse } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface ExportButtonsProps {
  results: ScrapeResponse;
}

export function ExportButtons({ results }: ExportButtonsProps) {
  const { toast } = useToast();

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportAsJSON = () => {
    try {
      const json = JSON.stringify(results, null, 2);
      const filename = `scrape-results-${new Date().toISOString().slice(0, 10)}.json`;
      downloadFile(json, filename, 'application/json');
      toast({
        title: 'Exported as JSON',
        description: `Downloaded ${filename}`,
      });
    } catch (error) {
      toast({
        title: 'Export failed',
        description: 'Could not export as JSON',
        variant: 'destructive',
      });
    }
  };

  const escapeCSV = (value: string) => {
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  };

  const exportAsCSV = () => {
    try {
      const sections: string[] = [];

      // Summary section
      if (results.summary) {
        sections.push('SUMMARY');
        sections.push(escapeCSV(results.summary));
        sections.push('');
      }

      // Links section
      if (results.links?.length > 0) {
        sections.push('LINKS');
        sections.push('Text,URL');
        results.links.forEach((link) => {
          sections.push(`${escapeCSV(link.text || '')},${escapeCSV(link.url)}`);
        });
        sections.push('');
      }

      // Images section
      if (results.images?.length > 0) {
        sections.push('IMAGES');
        sections.push('Alt Text,Source URL');
        results.images.forEach((img) => {
          sections.push(`${escapeCSV(img.alt || '')},${escapeCSV(img.src)}`);
        });
        sections.push('');
      }

      // Headers section
      if (results.headers?.length > 0) {
        sections.push('HEADERS');
        sections.push('Level,Text');
        results.headers.forEach((header) => {
          sections.push(`H${header.level},${escapeCSV(header.text)}`);
        });
        sections.push('');
      }

      // Resources section
      if (results.resources?.length > 0) {
        sections.push('RESOURCES');
        sections.push('Type,URL');
        results.resources.forEach((resource) => {
          sections.push(`${escapeCSV(resource.type)},${escapeCSV(resource.url)}`);
        });
      }

      const csv = sections.join('\n');
      const filename = `scrape-results-${new Date().toISOString().slice(0, 10)}.csv`;
      downloadFile(csv, filename, 'text/csv');
      toast({
        title: 'Exported as CSV',
        description: `Downloaded ${filename}`,
      });
    } catch (error) {
      toast({
        title: 'Export failed',
        description: 'Could not export as CSV',
        variant: 'destructive',
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-card border-border">
        <DropdownMenuItem onClick={exportAsJSON} className="gap-2 cursor-pointer">
          <FileJson className="h-4 w-4 text-yellow-500" />
          Export as JSON
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportAsCSV} className="gap-2 cursor-pointer">
          <FileSpreadsheet className="h-4 w-4 text-green-500" />
          Export as CSV
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
