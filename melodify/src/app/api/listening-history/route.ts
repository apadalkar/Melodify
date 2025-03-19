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

  if (!token) {
    return NextResponse.json({ error: 'No access token provided' }, { status: 401 });
  }

  try {
    // Fetch recently played tracks
    const response = await fetch('https://api.spotify.com/v1/me/player/recently-played?limit=50', {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch listening history');
    }

    const data: SpotifyHistoryResponse = await response.json();
    
    // Process the data to get listening statistics
    const trackPlays = new Map<string, { count: number; duration: number; track: SpotifyTrack }>();
    let totalMinutes = 0;

    data.items.forEach((item: SpotifyHistoryItem) => {
      const track = item.track;
      const trackId = track.id;
      const duration = track.duration_ms / 60000; // Convert to minutes
      
      if (trackPlays.has(trackId)) {
        const stats = trackPlays.get(trackId)!;
        stats.count += 1;
        stats.duration += duration;
      } else {
        trackPlays.set(trackId, { count: 1, duration, track });
      }
      
      totalMinutes += duration;
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