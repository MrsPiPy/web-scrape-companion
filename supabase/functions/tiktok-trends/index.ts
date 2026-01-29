const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const token = Deno.env.get('APIFY_API_TOKEN');
    if (!token) {
      return new Response(
        JSON.stringify({ success: false, error: 'Apify API token not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const startRes = await fetch(
      `https://api.apify.com/v2/acts/emastra~tiktok-trending-scraper/runs?token=${token}&waitForFinish=120`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ maxItems: 10 }),
      },
    );

    if (!startRes.ok) {
      const err = await startRes.text();
      throw new Error(`Apify run failed (${startRes.status}): ${err}`);
    }

    const runData = await startRes.json();
    const datasetId = runData?.data?.defaultDatasetId;
    if (!datasetId) throw new Error('No dataset returned');

    const itemsRes = await fetch(
      `https://api.apify.com/v2/datasets/${datasetId}/items?token=${token}&format=json`,
    );
    const videos = await itemsRes.json();

    const hashtagCounts: Record<string, number> = {};
    for (const video of videos) {
      if (video.hashtags) {
        for (const tag of video.hashtags) {
          const cleanTag = (tag.name || tag || '').toString().replace('#', '');
          if (cleanTag) {
            hashtagCounts[cleanTag] = (hashtagCounts[cleanTag] || 0) + 1;
          }
        }
      }
    }

    const hashtags = Object.entries(hashtagCounts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 50);

    return new Response(
      JSON.stringify({ success: true, hashtags, videoCount: videos.length }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (error) {
    console.error('TikTok trends error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch trends',
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
