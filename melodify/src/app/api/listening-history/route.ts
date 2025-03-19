import { NextResponse } from 'next/server';

interface SpotifyTrack {
  id: string;
  name: string;
  duration_ms: number;
  artists: { name: string }[];
  album: {
    images: { url: string }[];
  };
}

interface SpotifyHistoryItem {
  track: SpotifyTrack;
  played_at: string;
}

interface SpotifyHistoryResponse {
  items: SpotifyHistoryItem[];
}

export async function GET(request: Request) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');
  const { searchParams } = new URL(request.url);
  const timeRange = searchParams.get('timeRange') || 'week';

  if (!token) {
    return NextResponse.json({ error: 'No access token provided' }, { status: 401 });
  }

  try {
    // Calculate the time range in milliseconds
    const now = new Date().getTime();
    let timeRangeMs: number;
    switch (timeRange) {
      case 'day':
        timeRangeMs = 24 * 60 * 60 * 1000; // 24 hours
        break;
      case 'week':
        timeRangeMs = 7 * 24 * 60 * 60 * 1000; // 7 days
        break;
      case 'month':
        timeRangeMs = 30 * 24 * 60 * 60 * 1000; // 30 days
        break;
      default:
        timeRangeMs = 7 * 24 * 60 * 60 * 1000; // Default to week
    }

    // Fetch recently played tracks
    const response = await fetch('https://api.spotify.com/v1/me/player/recently-played?limit=50', {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch listening history');
    }

    const data: SpotifyHistoryResponse = await response.json();
    
    // Process the data to get listening statistics
    const trackPlays = new Map<string, { count: number; duration: number; track: SpotifyTrack; played_at: string }>();
    let totalMinutes = 0;

    data.items.forEach((item: SpotifyHistoryItem) => {
      const track = item.track;
      const trackId = track.id;
      const duration = track.duration_ms / 60000; // Convert to minutes
      const playedAt = new Date(item.played_at).getTime();
      
      // Only include tracks within the time range
      if (now - playedAt <= timeRangeMs) {
        if (trackPlays.has(trackId)) {
          const stats = trackPlays.get(trackId)!;
          stats.count += 1;
          stats.duration += duration;
        } else {
          trackPlays.set(trackId, { 
            count: 1, 
            duration, 
            track,
            played_at: item.played_at 
          });
        }
        
        totalMinutes += duration;
      }
    });

    // Convert to array format
    const listeningStats = Array.from(trackPlays.entries()).map(([trackId, stats]) => ({
      trackId,
      ...stats
    }));

    return NextResponse.json({
      listeningStats,
      totalMinutes,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching listening history:', error);
    return NextResponse.json({ error: 'Failed to fetch listening history' }, { status: 500 });
  }
} 