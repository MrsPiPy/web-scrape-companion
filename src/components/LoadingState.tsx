import { Loader2, Globe, FileText, Link, Image, Heading } from 'lucide-react';

export function LoadingState() {
  const steps = [
    { icon: Globe, label: 'Fetching page...' },
    { icon: FileText, label: 'Parsing content...' },
    { icon: Link, label: 'Extracting links...' },
    { icon: Image, label: 'Finding images...' },
    { icon: Heading, label: 'Analyzing structure...' },
  ];

  return (
    <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse-glow" />
        <div className="relative p-6 rounded-full bg-card border border-border">
          <Loader2 className="h-12 w-12 text-primary animate-spin-slow" />
        </div>
      </div>
      
      <h3 className="text-xl font-semibold mb-2">Analyzing webpage...</h3>
      <p className="text-muted-foreground text-sm mb-8">This may take 10-30 seconds</p>
      
      <div className="flex flex-wrap justify-center gap-3">
        {steps.map((step, index) => (
          <div
            key={index}
            className="flex items-center gap-2 px-4 py-2 bg-secondary/50 rounded-full text-xs text-muted-foreground"
            style={{ animationDelay: `${index * 0.2}s` }}
          >
            <step.icon className="h-3.5 w-3.5" />
            {step.label}
          </div>
        ))}
      </div>
    </div>
  );
}
