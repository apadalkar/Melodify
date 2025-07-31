'use client';

import { useEffect, useState } from 'react';

type ListeningStat = {
  trackId: string;
  count: number;
  duration: number;
  track?: {
    name: string;
    artists: { name: string }[];
    album: {
      images: { url: string }[];
    };
  };
  played_at?: string;
};

type TopAlbum = {
  albumId: string;
  albumName: string;
  albumImage: string;
  count: number;
  duration: number;
};

type MonthlyRecap = {
  month: string;
  totalMinutes: number;
  topTracks: any[];
  topAlbums: any[];
};

type ListeningStatsProps = {
  timeRange: 'day' | 'week' | 'month';
};

const ListeningStats = ({ timeRange }: ListeningStatsProps) => {
  const [stats, setStats] = useState<{
    listeningStats: ListeningStat[];
    topAlbums: TopAlbum[];
    monthlyRecaps: MonthlyRecap[];
    totalMinutes: number;
    lastUpdated: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem('spotify_access_token');
      
      if (!token) {
        setError('Please log in to view your listening statistics');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/listening-history', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch listening statistics');
        }

        const data = await response.json();
        
        const now = new Date();
        const filteredStats = data.listeningStats.filter((stat: ListeningStat) => {
          if (!stat.played_at) return false;
          const playedAt = new Date(stat.played_at);
          const diffInHours = (now.getTime() - playedAt.getTime()) / (1000 * 60 * 60);
          
          switch (timeRange) {
            case 'day':
              return diffInHours <= 24;
            case 'week':
              return diffInHours <= 24 * 7;
            case 'month':
              return diffInHours <= 24 * 30;
            default:
              return true;
          }
        });

        const totalMinutes = filteredStats.reduce((sum: number, stat: ListeningStat) => sum + stat.duration, 0);

        setStats({
          listeningStats: filteredStats,
          topAlbums: data.topAlbums || [],
          monthlyRecaps: data.monthlyRecaps || [],
          totalMinutes,
          lastUpdated: data.lastUpdated
        });
      } catch (err) {
        console.error('Error fetching listening stats:', err);
        setError('Failed to fetch listening statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [timeRange]);

  if (loading) return <div className="text-center py-4">Loading statistics...</div>;
  if (error) return <div className="text-red-500 text-center py-4">{error}</div>;
  if (!stats) return null;

  const totalHours = Math.round((stats.totalMinutes / 60) * 10) / 10;

  return (
    <div className="space-y-8">
      <div className="bg-gray-800 p-6 rounded-lg">
        <h3 className="text-xl font-bold text-green-400 mb-2">Total Listening Time</h3>
        <p className="text-3xl font-bold">{totalHours} hours</p>
        <p className="text-gray-400">({Math.round(stats.totalMinutes)} minutes)</p>
      </div>

      <div>
        <h3 className="text-xl font-bold text-green-400 mb-4">Most Played Tracks</h3>
        <div className="space-y-4">
          {stats.listeningStats
            .sort((a, b) => b.count - a.count)
            .slice(0, 5)
            .map((stat) => (
              <div
                key={stat.trackId}
                className="flex items-center bg-gray-800 p-4 rounded-lg"
              >
                <div className="flex-1">
                  <p className="font-semibold">{stat.track?.name || 'Unknown Track'}</p>
                  <p className="text-gray-400">
                    {stat.track?.artists.map(a => a.name).join(', ') || 'Unknown Artist'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{stat.count} plays</p>
                  <p className="text-gray-400">{Math.round(stat.duration)} minutes</p>
                </div>
              </div>
            ))}
        </div>
      </div>

      {stats.topAlbums.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-green-400 mb-4">Top Albums</h3>
          <div className="space-y-4">
            {stats.topAlbums.slice(0, 5).map((album) => (
              <div
                key={album.albumId}
                className="flex items-center bg-gray-800 p-4 rounded-lg"
              >
                {album.albumImage && (
                  <img
                    src={album.albumImage}
                    alt={album.albumName}
                    className="w-16 h-16 rounded-lg mr-4"
                  />
                )}
                <div className="flex-1">
                  <p className="font-semibold">{album.albumName}</p>
                  <p className="text-gray-400">{Math.round(album.duration)} minutes</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{album.count} plays</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {stats.monthlyRecaps.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-green-400 mb-4">Monthly Recaps</h3>
          <div className="space-y-6">
            {stats.monthlyRecaps.map((recap) => (
              <div key={recap.month} className="bg-gray-800 p-4 rounded-lg">
                <h4 className="text-lg font-semibold mb-3">
                  {new Date(recap.month + '-01').toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long' 
                  })}
                </h4>
                <p className="text-gray-400 mb-3">
                  {Math.round(recap.totalMinutes / 60 * 10) / 10} hours listened
                </p>
                {recap.topTracks.length > 0 && (
                  <div className="mb-3">
                    <p className="text-sm font-semibold text-gray-300 mb-2">Top Track:</p>
                    <p className="text-sm">
                      {recap.topTracks[0]?.track?.name || 'Unknown'} - {recap.topTracks[0]?.count || 0} plays
                    </p>
                  </div>
                )}
                {recap.topAlbums.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-gray-300 mb-2">Top Album:</p>
                    <p className="text-sm">
                      {recap.topAlbums[0]?.albumName || 'Unknown'} - {recap.topAlbums[0]?.count || 0} plays
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="text-sm text-gray-500 text-center">
        Last updated: {new Date(stats.lastUpdated).toLocaleString()}
      </p>
    </div>
  );
};

export default ListeningStats; 