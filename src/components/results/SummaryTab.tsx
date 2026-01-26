import { Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface SummaryTabProps {
  summary: string;
}

export function SummaryTab({ summary }: SummaryTabProps) {
  if (!summary) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <Sparkles className="h-8 w-8 mb-3" />
        <p>No summary available</p>
      </div>
    );
  }

  return (
    <Card className="p-6 bg-card border-border animate-fade-in">
      <div className="flex items-start gap-4">
        <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <h4 className="font-medium mb-2 text-primary">AI Summary</h4>
          <p className="text-foreground/90 leading-relaxed">{summary}</p>
        </div>
      </div>
    </Card>
  );
}
