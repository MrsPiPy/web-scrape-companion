import { ScrapeResponse } from './supabase';

export const demoScrapeResult: ScrapeResponse = {
  job_id: 'demo-job-001',
  summary: `# Example.com - Demo Page

This is a demonstration of the web scraper results. The page contains various elements including navigation links, images, and structured content.

## Key Features
- Clean, semantic HTML structure
- Responsive design
- Multiple navigation sections
- Rich media content

## Page Statistics
- Total Links: 12
- Images: 5
- External Resources: 8
- Headers: 6 levels used`,

  links: [
    { text: 'Home', url: 'https://example.com/' },
    { text: 'About Us', url: 'https://example.com/about' },
    { text: 'Products', url: 'https://example.com/products' },
    { text: 'Services', url: 'https://example.com/services' },
    { text: 'Blog', url: 'https://example.com/blog' },
    { text: 'Contact', url: 'https://example.com/contact' },
    { text: 'Privacy Policy', url: 'https://example.com/privacy' },
    { text: 'Terms of Service', url: 'https://example.com/terms' },
    { text: 'GitHub Repository', url: 'https://github.com/example/repo' },
    { text: 'Documentation', url: 'https://docs.example.com' },
    { text: 'API Reference', url: 'https://api.example.com/docs' },
    { text: 'Support Center', url: 'https://support.example.com' },
  ],

  images: [
    { src: 'https://picsum.photos/800/400', alt: 'Hero banner image' },
    { src: 'https://picsum.photos/400/300', alt: 'Product showcase' },
    { src: 'https://picsum.photos/200/200', alt: 'Team member photo' },
    { src: 'https://picsum.photos/300/200', alt: 'Office location' },
    { src: 'https://picsum.photos/150/150', alt: 'Company logo' },
  ],

  headers: [
    { level: 1, text: 'Welcome to Example.com' },
    { level: 2, text: 'Our Mission' },
    { level: 2, text: 'Featured Products' },
    { level: 3, text: 'Product Category A' },
    { level: 3, text: 'Product Category B' },
    { level: 2, text: 'Latest News' },
    { level: 3, text: 'Company Updates' },
    { level: 3, text: 'Industry Insights' },
    { level: 2, text: 'Get In Touch' },
    { level: 4, text: 'Contact Form' },
  ],

  resources: [
    { type: 'stylesheet', url: 'https://example.com/css/main.css' },
    { type: 'stylesheet', url: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700' },
    { type: 'script', url: 'https://example.com/js/app.js' },
    { type: 'script', url: 'https://example.com/js/analytics.js' },
    { type: 'script', url: 'https://cdn.example.com/lib/utils.min.js' },
    { type: 'font', url: 'https://fonts.gstatic.com/s/inter/v12/font.woff2' },
    { type: 'icon', url: 'https://example.com/favicon.ico' },
    { type: 'manifest', url: 'https://example.com/manifest.json' },
  ],
};
