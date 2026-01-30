const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform',
};

interface SocialScrapeRequest {
  platform: 'tiktok' | 'youtube' | 'instagram';
  keywords: string[];
  maxResults?: number;
}

const ACTOR_MAP: Record<string, string> = {
  tiktok: 'clockworks/tiktok-hashtag-scraper',
  youtube: 'scrapesmith/youtube-free-search-scraper',
  instagram: 'apify/instagram-hashtag-scraper',
  instagram_profile: 'apify/instagram-profile-scraper',
};

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
        videosPerSearch: maxResults,
      };
    case 'instagram':
      return {
        hashtags: keywords,
        resultsLimit: maxResults,
      };
    case 'instagram_profile':
      return {
        usernames: keywords,
      };
    default:
      throw new Error(`Unsupported platform: ${platform}`);
  }
}

function normalizeResults(platform: string, items: Record<string, unknown>[]) {
  return items.flatMap((item: Record<string, unknown>) => {
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
          id: item['01 ID'],
          url: item['11 Video URL'],
          title: item['02 Title'],
          description: item['12 Description'],
          author: item['09 Channel Name'],
          views: item['03 Views'],
          likes: item['04 Likes'],
          comments: item['05 Comments'],
          thumbnail: item['13 Thumbnail'],
          publishedAt: item['07 Date Posted'],
          duration: item['06 Duration'],
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
      case 'instagram_profile': {
        const posts = (item.latestPosts as Record<string, unknown>[]) || [];
        const profileCard = {
          platform: 'instagram',
          id: item.id || item.username,
          url: item.url || `https://www.instagram.com/${item.username}/`,
          title: `${item.fullName || item.username}`,
          description: item.biography,
          author: item.username,
          views: item.followersCount,
          likes: item.postsCount,
          comments: item.followsCount,
          imageUrl: item.profilePicUrl,
        };
        const postCards = posts.map((p: Record<string, unknown>) => ({
          platform: 'instagram',
          id: p.id,
          url: p.url,
          caption: p.caption,
          author: item.username,
          likes: p.likesCount,
          comments: p.commentsCount,
          views: p.videoViewCount || 0,
          imageUrl: p.displayUrl,
          type: p.type,
          timestamp: p.timestamp,
        }));
        return [profileCard, ...postCards];
      }
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

    // For Instagram, detect @ prefixed inputs and route to profile scraper
    let resolvedPlatform = platform;
    let resolvedActorId = actorId;
    const cleanedKeywords = keywords.map((k: string) => k.replace(/^[@#]/, ''));

    if (platform === 'instagram') {
      const hasUsernames = keywords.some((k: string) => k.startsWith('@'));
      if (hasUsernames) {
        resolvedPlatform = 'instagram_profile';
        resolvedActorId = ACTOR_MAP.instagram_profile;
      }
    }

    console.log(`Social scrape: ${resolvedPlatform} | keywords: ${cleanedKeywords.join(', ')}`);

    const input = buildActorInput(resolvedPlatform, cleanedKeywords, maxResults);
    const { datasetId } = await callApifyActor(token, resolvedActorId, input);
    const items = await fetchDataset(token, datasetId, maxResults);
    const results = normalizeResults(resolvedPlatform, items);

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
