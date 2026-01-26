import { ExternalLink, Link as LinkIcon } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Link {
  url: string;
  text: string;
}

interface LinksTabProps {
  links: Link[];
}

export function LinksTab({ links }: LinksTabProps) {
  if (!links || links.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <LinkIcon className="h-8 w-8 mb-3" />
        <p>No links found</p>
      </div>
    );
  }

  return (
    <div className="border border-border rounded-lg overflow-hidden animate-fade-in">
      <Table>
        <TableHeader>
          <TableRow className="border-border hover:bg-transparent">
            <TableHead className="text-muted-foreground font-medium">Link Text</TableHead>
            <TableHead className="text-muted-foreground font-medium">URL</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {links.map((link, index) => (
            <TableRow key={index} className="border-border hover:bg-secondary/50">
              <TableCell className="font-medium max-w-xs truncate">
                {link.text || <span className="text-muted-foreground italic">No text</span>}
              </TableCell>
              <TableCell>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary hover:underline font-mono text-sm max-w-md truncate"
                >
                  {link.url}
                  <ExternalLink className="h-3 w-3 shrink-0" />
                </a>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="px-4 py-3 border-t border-border bg-secondary/30">
        <p className="text-sm text-muted-foreground">
          {links.length} link{links.length !== 1 ? 's' : ''} found
        </p>
      </div>
    </div>
  );
}
