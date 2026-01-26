import { FileCode, FileJson, Video, FileText, ExternalLink, Folder } from 'lucide-react';

interface Resource {
  type: string;
  url: string;
}

interface ResourcesTabProps {
  resources: Resource[];
}

const ResourceIcons: Record<string, typeof FileCode> = {
  script: FileCode,
  stylesheet: FileText,
  video: Video,
  json: FileJson,
  default: Folder,
};

const ResourceColors: Record<string, string> = {
  script: 'text-yellow-500 bg-yellow-500/10',
  stylesheet: 'text-blue-500 bg-blue-500/10',
  video: 'text-pink-500 bg-pink-500/10',
  json: 'text-green-500 bg-green-500/10',
  default: 'text-muted-foreground bg-muted',
};

export function ResourcesTab({ resources }: ResourcesTabProps) {
  if (!resources || resources.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <Folder className="h-8 w-8 mb-3" />
        <p>No resources found</p>
      </div>
    );
  }

  // Group resources by type
  const grouped = resources.reduce((acc, resource) => {
    const type = resource.type || 'other';
    if (!acc[type]) acc[type] = [];
    acc[type].push(resource);
    return acc;
  }, {} as Record<string, Resource[]>);

  return (
    <div className="space-y-6 animate-fade-in">
      {Object.entries(grouped).map(([type, items]) => {
        const Icon = ResourceIcons[type] || ResourceIcons.default;
        const colorClass = ResourceColors[type] || ResourceColors.default;
        
        return (
          <div key={type}>
            <div className="flex items-center gap-2 mb-3">
              <div className={`p-1.5 rounded ${colorClass}`}>
                <Icon className="h-4 w-4" />
              </div>
              <h4 className="font-medium capitalize">{type}</h4>
              <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                {items.length}
              </span>
            </div>
            
            <div className="space-y-2">
              {items.map((resource, index) => (
                <a
                  key={index}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-3 rounded-lg bg-card border border-border hover:border-primary/30 transition-colors group"
                >
                  <span className="font-mono text-sm text-foreground/80 truncate flex-1">
                    {resource.url}
                  </span>
                  <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                </a>
              ))}
            </div>
          </div>
        );
      })}
      
      <div className="px-4 py-3 border border-border rounded-lg bg-secondary/30">
        <p className="text-sm text-muted-foreground">
          {resources.length} resource{resources.length !== 1 ? 's' : ''} found
        </p>
      </div>
    </div>
  );
}
