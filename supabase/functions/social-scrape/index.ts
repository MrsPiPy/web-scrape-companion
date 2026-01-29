const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform',
};

interface SocialScrapeRequest {
  platform: 'tiktok' | 'youtube' | 'instagram';
  keywords: string[];
  maxResults?: number;
}

const ACTOR_MAP = {
  tiktok: 'clockworks/tiktok-hashtag-scraper',
  youtube: 'streamers/youtube-shorts-scraper',
  instagram: 'apify/instagram-hashtag-scraper',
} as const;

async function callApifyActor(
  token: string,
  actorId: string,
  input: Record<string, unknown>,
): Promise<{ datasetId: string }> {
  const encodedActorId = actorId.replace('/', '~');
  const res = await fetch(
    `https://api.apify.com/v2/acts/${encodedActorId}/runs?token=${token}&waitForFinish=120`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    },
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Apify run failed (${res.status}): ${err}`);
  }

  const run = await res.json();
  const datasetId = run?.data?.defaultDatasetId;
  if (!datasetId) throw new Error('No dataset returned from Apify run');
  return { datasetId };
}

async function fetchDataset(token: string, datasetId: string, limit: number) {
  const res = await fetch(
    `https://api.apify.com/v2/datasets/${datasetId}/items?token=${token}&limit=${limit}&format=json`,
  );
  if (!res.ok) throw new Error(`Failed to fetch dataset: ${res.status}`);
  return res.json();
}

function buildActorInput(platform: string, keywords: string[], maxResults: number) {
  switch (platform) {
    case 'tiktok':
      return {
        hashtags: keywords,
        resultsPerPage: maxResults,
      };
    case 'youtube':
      return {
        searchQueries: keywords,
        maxResults,
      };
    case 'instagram':
      return {
        hashtags: keywords,
        resultsLimit: maxResults,
      };
    default:
      throw new Error(`Unsupported platform: ${platform}`);
  }
}

function normalizeResults(platform: string, items: Record<string, unknown>[]) {
  return items.map((item: Record<string, unknown>) => {
    switch (platform) {
      case 'tiktok':
        return {
          platform: 'tiktok',
          id: item.id,
          url: item.webVideoUrl || item.url,
          description: item.text || item.desc,
          author: (item.authorMeta as Record<string, unknown>)?.name || item.author,
          likes: item.diggCount || item.likes,
          views: item.playCount || item.views,
          comments: item.commentCount || item.comments,
          shares: item.shareCount || item.shares,
          hashtags: item.hashtags,
          thumbnail: item.videoMeta
            ? (item.videoMeta as Record<string, unknown>).coverUrl
            : item.thumbnail,
          createdAt: item.createTimeISO || item.createTime,
        };
      case 'youtube':
        return {
          platform: 'youtube',
          id: item.id || item.videoId,
          url: item.url || (item.videoId ? `https://youtube.com/shorts/${item.videoId}` : ''),
          title: item.title || item.caption,
          author: item.channelName || item.channel,
          views: item.viewCount || item.views,
          likes: item.likeCount || item.likes,
          comments: item.commentCount,
          thumbnail: item.thumbnailUrl || item.thumbnail,
          publishedAt: item.uploadDate || item.publishedAt,
          hashtags: item.hashtags,
        };
      case 'instagram':
        return {
          platform: 'instagram',
          id: item.id,
          url: item.url,
          caption: item.caption,
          author: item.ownerUsername || item.owner,
          likes: item.likesCount || item.likes,
          comments: item.commentsCount || item.comments,
          views: item.videoViewCount || item.views,
          imageUrl: item.displayUrl || item.imageUrl,
          type: item.type,
          hashtags: item.hashtags,
          timestamp: item.timestamp,
        };
      default:
        return { platform, ...item };
    }
  });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body: SocialScrapeRequest = await req.json();
    const { platform, keywords, maxResults = 20 } = body;

    if (!platform || !keywords?.length) {
      return new Response(
        JSON.stringify({ success: false, error: 'platform and keywords are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const actorId = ACTOR_MAP[platform];
    if (!actorId) {
      return new Response(
        JSON.stringify({ success: false, error: `Unsupported platform: ${platform}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const token = Deno.env.get('APIFY_API_TOKEN');
    if (!token) {
      return new Response(
        JSON.stringify({ success: false, error: 'Apify API token not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    console.log(`Social scrape: ${platform} | keywords: ${keywords.join(', ')}`);

    const input = buildActorInput(platform, keywords, maxResults);
    const { datasetId } = await callApifyActor(token, actorId, input);
    const items = await fetchDataset(token, datasetId, maxResults);
    const results = normalizeResults(platform, items);

    return new Response(
      JSON.stringify({
        success: true,
        platform,
        keywords,
        count: results.length,
        results,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (error) {
    console.error('Social scrape error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Social scrape failed',
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
