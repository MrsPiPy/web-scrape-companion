import { Heading1, Heading2, Heading3, Heading4, Heading5, Heading6 } from 'lucide-react';

interface Header {
  level: number;
  text: string;
}

interface HeadersTabProps {
  headers: Header[];
}

const HeadingIcons = {
  1: Heading1,
  2: Heading2,
  3: Heading3,
  4: Heading4,
  5: Heading5,
  6: Heading6,
};

export function HeadersTab({ headers }: HeadersTabProps) {
  if (!headers || headers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <Heading1 className="h-8 w-8 mb-3" />
        <p>No headers found</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 animate-fade-in">
      {headers.map((header, index) => {
        const Icon = HeadingIcons[header.level as keyof typeof HeadingIcons] || Heading1;
        const indent = (header.level - 1) * 16;
        
        return (
          <div
            key={index}
            className="flex items-start gap-3 p-3 rounded-lg bg-card border border-border hover:border-primary/30 transition-colors"
            style={{ marginLeft: indent }}
          >
            <div className="p-1.5 rounded bg-primary/10 text-primary shrink-0">
              <Icon className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-xs text-muted-foreground font-mono">H{header.level}</span>
              <p className={`font-medium ${header.level === 1 ? 'text-lg' : header.level === 2 ? 'text-base' : 'text-sm'}`}>
                {header.text}
              </p>
            </div>
          </div>
        );
      })}
      
      <div className="mt-4 px-4 py-3 border border-border rounded-lg bg-secondary/30">
        <p className="text-sm text-muted-foreground">
          {headers.length} header{headers.length !== 1 ? 's' : ''} found
        </p>
      </div>
    </div>
  );
}
