import { useState } from 'react';
import { Image as ImageIcon, ExternalLink, X } from 'lucide-react';
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';

interface ImageData {
  src: string;
  alt: string;
}

interface ImagesTabProps {
  images: ImageData[];
}

export function ImagesTab({ images }: ImagesTabProps) {
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);

  if (!images || images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <ImageIcon className="h-8 w-8 mb-3" />
        <p>No images found</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-fade-in">
        {images.map((image, index) => (
          <div
            key={index}
            className="group relative aspect-video bg-secondary rounded-lg overflow-hidden border border-border hover:border-primary/50 transition-colors cursor-pointer"
            onClick={() => setSelectedImage(image)}
          >
            <img
              src={image.src}
              alt={image.alt || 'Image'}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder.svg';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
              <p className="text-xs text-foreground truncate">
                {image.alt || 'No alt text'}
              </p>
            </div>
            <a
              href={image.src}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="absolute top-2 right-2 p-1.5 rounded bg-background/80 text-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background"
            >
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        ))}
      </div>
      
      <div className="mt-4 px-4 py-3 border border-border rounded-lg bg-secondary/30">
        <p className="text-sm text-muted-foreground">
          {images.length} image{images.length !== 1 ? 's' : ''} found
        </p>
      </div>

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl bg-card border-border p-0 overflow-hidden">
          <DialogClose className="absolute top-3 right-3 z-10 p-2 rounded-full bg-background/80 hover:bg-background">
            <X className="h-4 w-4" />
          </DialogClose>
          {selectedImage && (
            <div className="p-4">
              <img
                src={selectedImage.src}
                alt={selectedImage.alt || 'Image'}
                className="w-full max-h-[70vh] object-contain rounded-lg"
              />
              <div className="mt-4 space-y-2">
                <p className="text-sm font-medium">{selectedImage.alt || 'No alt text'}</p>
                <a
                  href={selectedImage.src}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs text-primary hover:underline font-mono"
                >
                  {selectedImage.src}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
