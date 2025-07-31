import { NextResponse } from 'next/server';

interface SpotifyTrack {
  id: string;
  name: string;
  duration_ms: number;
  artists: { name: string }[];
  album: {
    id?: string;
    name: string;
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
    const now = new Date().getTime();
    let timeRangeMs: number;
    switch (timeRange) {
      case 'day':
        timeRangeMs = 24 * 60 * 60 * 1000;
        break;
      case 'week':
        timeRangeMs = 7 * 24 * 60 * 60 * 1000;
        break;
      case 'month':
        timeRangeMs = 30 * 24 * 60 * 60 * 1000;
        break;
      default:
        timeRangeMs = 7 * 24 * 60 * 60 * 1000;
    }

    const response = await fetch('https://api.spotify.com/v1/me/player/recently-played?limit=50', {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Spotify API error:', errorText);
      throw new Error('Failed to fetch listening history');
    }

    const data: SpotifyHistoryResponse = await response.json();

    const trackPlays = new Map<string, { count: number; duration: number; track: SpotifyTrack; played_at: string }>();
    const albumPlays = new Map<string, { albumId: string; albumName: string; albumImage: string; count: number; duration: number }>();
    const monthlyRecaps = new Map<string, { totalMinutes: number; trackStats: Map<string, any>; albumStats: Map<string, any> }>();
    let totalMinutes = 0;

    data.items.forEach((item: SpotifyHistoryItem) => {
      const track = item.track;
      const trackId = track.id;
      const duration = track.duration_ms / 60000;
      const playedAt = new Date(item.played_at).getTime();
      const albumId = track.album.id || track.album.name;
      const albumName = track.album.name;
      const albumImage = track.album.images?.[0]?.url || '';
      const monthKey = item.played_at.slice(0, 7); // YYYY-MM

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
            played_at: item.played_at,
          });
        }
        if (albumPlays.has(albumId)) {
          const stats = albumPlays.get(albumId)!;
          stats.count += 1;
          stats.duration += duration;
        } else {
          albumPlays.set(albumId, {
            albumId,
            albumName,
            albumImage,
            count: 1,
            duration,
          });
        }
        totalMinutes += duration;
      }

      // Monthly Recap
      if (!monthlyRecaps.has(monthKey)) {
        monthlyRecaps.set(monthKey, {
          totalMinutes: 0,
          trackStats: new Map(),
          albumStats: new Map(),
        });
      }
      const monthRecap = monthlyRecaps.get(monthKey)!;
      monthRecap.totalMinutes += duration;
      // Track stats per month
      if (monthRecap.trackStats.has(trackId)) {
        const stats = monthRecap.trackStats.get(trackId);
        stats.count += 1;
        stats.duration += duration;
      } else {
        monthRecap.trackStats.set(trackId, {
          count: 1,
          duration,
          track,
        });
      }
      // Album stats per month
      if (monthRecap.albumStats.has(albumId)) {
        const stats = monthRecap.albumStats.get(albumId);
        stats.count += 1;
        stats.duration += duration;
        stats.albumName = albumName;
        stats.albumImage = albumImage;
      } else {
        monthRecap.albumStats.set(albumId, {
          albumId,
          albumName,
          albumImage,
          count: 1,
          duration,
        });
      }
    });

    const listeningStats = Array.from(trackPlays.entries()).map(([trackId, stats]) => ({
      trackId,
      ...stats,
    }));
    const topAlbums = Array.from(albumPlays.values()).sort((a, b) => b.count - a.count);
    const monthlyRecapsArr = Array.from(monthlyRecaps.entries()).map(([month, recap]) => ({
      month,
      totalMinutes: recap.totalMinutes,
      topTracks: Array.from(recap.trackStats.values()).sort((a, b) => b.count - a.count),
      topAlbums: Array.from(recap.albumStats.values()).sort((a, b) => b.count - a.count),
    }));

    return NextResponse.json({
      listeningStats,
      topAlbums,
      monthlyRecaps: monthlyRecapsArr,
      totalMinutes,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching listening history:', error);
    return NextResponse.json({ error: 'Failed to fetch listening history' }, { status: 500 });
  }
} 