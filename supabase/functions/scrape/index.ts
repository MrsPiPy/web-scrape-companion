const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();

    if (!url) {
      return new Response(
        JSON.stringify({ success: false, error: 'URL is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = Deno.env.get('FIRECRAWL_API_KEY');
    if (!apiKey) {
      console.error('FIRECRAWL_API_KEY not configured');
      return new Response(
        JSON.stringify({ success: false, error: 'Firecrawl connector not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Format URL
    let formattedUrl = url.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = `https://${formattedUrl}`;
    }

    console.log('Scraping URL:', formattedUrl);

    const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: formattedUrl,
        formats: ['markdown', 'html', 'links'],
        onlyMainContent: false,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Firecrawl API error:', data);
      return new Response(
        JSON.stringify({ success: false, error: data.error || `Request failed with status ${response.status}` }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Scrape successful');

    // Extract data from Firecrawl response
    const scrapeData = data.data || data;
    const html = scrapeData.html || '';
    const markdown = scrapeData.markdown || '';
    const metadata = scrapeData.metadata || {};

    // Parse headers from HTML
    const headers: { level: number; text: string }[] = [];
    const headerRegex = /<h([1-6])[^>]*>(.*?)<\/h\1>/gi;
    let match: RegExpExecArray | null;
    while ((match = headerRegex.exec(html)) !== null) {
      const text = match[2].replace(/<[^>]*>/g, '').trim();
      if (text) {
        headers.push({ level: parseInt(match[1]), text });
      }
    }

    // Parse images from HTML
    const images: { src: string; alt: string }[] = [];
    const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*(?:alt=["']([^"']*)["'])?[^>]*>/gi;
    while ((match = imgRegex.exec(html)) !== null) {
      const src = match[1];
      const alt = match[2] || '';
      if (src && !src.startsWith('data:')) {
        images.push({ src, alt });
      }
    }

    // Also check for alt before src pattern
    const imgRegex2 = /<img[^>]+alt=["']([^"']*)["'][^>]*src=["']([^"']+)["'][^>]*>/gi;
    while ((match = imgRegex2.exec(html)) !== null) {
      const alt = match[1] || '';
      const src = match[2];
      if (src && !src.startsWith('data:') && !images.some(img => img.src === src)) {
        images.push({ src, alt });
      }
    }

    // Parse links from Firecrawl response or HTML
    const links: { url: string; text: string }[] = [];
    if (scrapeData.links && Array.isArray(scrapeData.links)) {
      scrapeData.links.forEach((link: string) => {
        links.push({ url: link, text: '' });
      });
    } else {
      const linkRegex = /<a[^>]+href=["']([^"']+)["'][^>]*>(.*?)<\/a>/gi;
      while ((match = linkRegex.exec(html)) !== null) {
        const url = match[1];
        const text = match[2].replace(/<[^>]*>/g, '').trim();
        if (url && !url.startsWith('#') && !url.startsWith('javascript:')) {
          links.push({ url, text });
        }
      }
    }

    // Parse resources (scripts, stylesheets)
    const resources: { type: string; url: string }[] = [];
    const scriptRegex = /<script[^>]+src=["']([^"']+)["'][^>]*>/gi;
    while ((match = scriptRegex.exec(html)) !== null) {
      resources.push({ type: 'script', url: match[1] });
    }
    const styleRegex = /<link[^>]+href=["']([^"']+)["'][^>]*rel=["']stylesheet["'][^>]*>/gi;
    while ((match = styleRegex.exec(html)) !== null) {
      resources.push({ type: 'stylesheet', url: match[1] });
    }
    const styleRegex2 = /<link[^>]+rel=["']stylesheet["'][^>]*href=["']([^"']+)["'][^>]*>/gi;
    while ((match = styleRegex2.exec(html)) !== null) {
      const styleUrl = match[1];
      if (!resources.some(r => r.url === styleUrl)) {
        resources.push({ type: 'stylesheet', url: styleUrl });
      }
    }

    // Generate summary
    const summary = metadata.description || 
      metadata.ogDescription || 
      markdown.substring(0, 500).replace(/[#*_\[\]]/g, '').trim() + '...';

    const result = {
      success: true,
      job_id: crypto.randomUUID(),
      summary,
      links,
      images,
      headers,
      resources,
      metadata: {
        title: metadata.title || '',
        sourceURL: formattedUrl,
      }
    };

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error scraping:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to scrape';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
