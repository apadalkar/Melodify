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

type ListeningStatsProps = {
  timeRange: 'day' | 'week' | 'month';
};

const ListeningStats = ({ timeRange }: ListeningStatsProps) => {
  const [stats, setStats] = useState<{
    listeningStats: ListeningStat[];
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
        
        // Filter data based on timeRange
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

        // Recalculate total minutes for filtered data
        const totalMinutes = filteredStats.reduce((sum: number, stat: ListeningStat) => sum + stat.duration, 0);

        setStats({
          listeningStats: filteredStats,
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

  return (
    <div className="space-y-6">
      <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="text-xl font-bold text-green-400 mb-2">Total Listening Time</h3>
        <p className="text-2xl">{Math.round(stats.totalMinutes)} minutes</p>
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

      <p className="text-sm text-gray-500 text-center">
        Last updated: {new Date(stats.lastUpdated).toLocaleString()}
      </p>
    </div>
  );
};

export default ListeningStats; 