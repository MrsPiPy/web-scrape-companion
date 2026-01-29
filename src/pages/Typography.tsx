export default function Typography() {
  return (
    <div className="min-h-screen bg-background p-8 space-y-12">
      <div>
        <h1 className="text-4xl font-bold text-gradient mb-2">Typography Guide</h1>
        <p className="text-muted-foreground">Text styles and sizes in your design system</p>
      </div>

      {/* Headings */}
      <section className="space-y-6">
        <h2 className="text-xl font-semibold text-foreground border-b border-border pb-2">Headings</h2>
        <div className="space-y-4">
          <div className="flex items-baseline gap-4">
            <span className="text-xs text-muted-foreground w-24 font-mono">text-5xl</span>
            <span className="text-5xl font-bold text-foreground">The quick brown fox</span>
          </div>
          <div className="flex items-baseline gap-4">
            <span className="text-xs text-muted-foreground w-24 font-mono">text-4xl</span>
            <span className="text-4xl font-bold text-foreground">The quick brown fox</span>
          </div>
          <div className="flex items-baseline gap-4">
            <span className="text-xs text-muted-foreground w-24 font-mono">text-3xl</span>
            <span className="text-3xl font-bold text-foreground">The quick brown fox</span>
          </div>
          <div className="flex items-baseline gap-4">
            <span className="text-xs text-muted-foreground w-24 font-mono">text-2xl</span>
            <span className="text-2xl font-semibold text-foreground">The quick brown fox</span>
          </div>
          <div className="flex items-baseline gap-4">
            <span className="text-xs text-muted-foreground w-24 font-mono">text-xl</span>
            <span className="text-xl font-semibold text-foreground">The quick brown fox</span>
          </div>
          <div className="flex items-baseline gap-4">
            <span className="text-xs text-muted-foreground w-24 font-mono">text-lg</span>
            <span className="text-lg font-medium text-foreground">The quick brown fox</span>
          </div>
        </div>
      </section>

      {/* Body Text */}
      <section className="space-y-6">
        <h2 className="text-xl font-semibold text-foreground border-b border-border pb-2">Body Text</h2>
        <div className="space-y-4">
          <div className="flex items-baseline gap-4">
            <span className="text-xs text-muted-foreground w-24 font-mono">text-base</span>
            <span className="text-base text-foreground">The quick brown fox jumps over the lazy dog.</span>
          </div>
          <div className="flex items-baseline gap-4">
            <span className="text-xs text-muted-foreground w-24 font-mono">text-sm</span>
            <span className="text-sm text-foreground">The quick brown fox jumps over the lazy dog.</span>
          </div>
          <div className="flex items-baseline gap-4">
            <span className="text-xs text-muted-foreground w-24 font-mono">text-xs</span>
            <span className="text-xs text-foreground">The quick brown fox jumps over the lazy dog.</span>
          </div>
        </div>
      </section>

      {/* Font Weights */}
      <section className="space-y-6">
        <h2 className="text-xl font-semibold text-foreground border-b border-border pb-2">Font Weights</h2>
        <div className="space-y-4">
          <div className="flex items-baseline gap-4">
            <span className="text-xs text-muted-foreground w-24 font-mono">font-bold</span>
            <span className="text-lg font-bold text-foreground">The quick brown fox</span>
          </div>
          <div className="flex items-baseline gap-4">
            <span className="text-xs text-muted-foreground w-24 font-mono">font-semibold</span>
            <span className="text-lg font-semibold text-foreground">The quick brown fox</span>
          </div>
          <div className="flex items-baseline gap-4">
            <span className="text-xs text-muted-foreground w-24 font-mono">font-medium</span>
            <span className="text-lg font-medium text-foreground">The quick brown fox</span>
          </div>
          <div className="flex items-baseline gap-4">
            <span className="text-xs text-muted-foreground w-24 font-mono">font-normal</span>
            <span className="text-lg font-normal text-foreground">The quick brown fox</span>
          </div>
        </div>
      </section>

      {/* Colors */}
      <section className="space-y-6">
        <h2 className="text-xl font-semibold text-foreground border-b border-border pb-2">Text Colors</h2>
        <div className="space-y-4">
          <div className="flex items-baseline gap-4">
            <span className="text-xs text-muted-foreground w-32 font-mono">text-foreground</span>
            <span className="text-base text-foreground">Primary text color</span>
          </div>
          <div className="flex items-baseline gap-4">
            <span className="text-xs text-muted-foreground w-32 font-mono">text-muted-foreground</span>
            <span className="text-base text-muted-foreground">Muted/secondary text</span>
          </div>
          <div className="flex items-baseline gap-4">
            <span className="text-xs text-muted-foreground w-32 font-mono">text-primary</span>
            <span className="text-base text-primary">Primary accent color</span>
          </div>
          <div className="flex items-baseline gap-4">
            <span className="text-xs text-muted-foreground w-32 font-mono">text-destructive</span>
            <span className="text-base text-destructive">Destructive/error color</span>
          </div>
          <div className="flex items-baseline gap-4">
            <span className="text-xs text-muted-foreground w-32 font-mono">text-gradient</span>
            <span className="text-base text-gradient font-semibold">Gradient text effect</span>
          </div>
        </div>
      </section>

      {/* Fonts */}
      <section className="space-y-6">
        <h2 className="text-xl font-semibold text-foreground border-b border-border pb-2">Font Families</h2>
        <div className="space-y-4">
          <div className="flex items-baseline gap-4">
            <span className="text-xs text-muted-foreground w-24 font-mono">font-sans</span>
            <span className="text-lg font-sans text-foreground">Inter - The quick brown fox (default)</span>
          </div>
          <div className="flex items-baseline gap-4">
            <span className="text-xs text-muted-foreground w-24 font-mono">font-mono</span>
            <span className="text-lg font-mono text-foreground">JetBrains Mono - code style</span>
          </div>
        </div>
      </section>
    </div>
  );
}
