'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ListeningStats from './ListeningStats';
import Image from 'next/image';

type ViewType = 'stats' | 'top';

type Track = {
  id: string;
  name: string;
  album: {
    images: { url: string }[];
  };
  artists: { name: string }[];
};

type Artist = {
  id: string;
  name: string;
  images: { url: string }[];
  genres: string[];
};

const DashboardContent = () => {
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('week');
  const [viewType, setViewType] = useState<ViewType>('stats');
  const [topTracks, setTopTracks] = useState<Track[]>([]);
  const [topArtists, setTopArtists] = useState<Artist[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const urlToken = searchParams.get('access_token');
    const storedToken = localStorage.getItem('spotify_access_token');
    const token = urlToken || storedToken;

    if (!token) {
      setError('Please log in to view your dashboard');
      router.push('/');
      return;
    }

    if (urlToken) {
      localStorage.setItem('spotify_access_token', urlToken);
      const params = new URLSearchParams(window.location.search);
      params.delete('access_token');
      window.history.replaceState({}, document.title, window.location.pathname + (params.toString() ? '?' + params.toString() : ''));
    }

    if (viewType === 'top') {
      const fetchTopData = async () => {
        try {
          const [tracksRes, artistsRes] = await Promise.all([
            fetch('https://api.spotify.com/v1/me/top/tracks?limit=20', {
              headers: { Authorization: `Bearer ${token}` },
            }),
            fetch('https://api.spotify.com/v1/me/top/artists?limit=20', {
              headers: { Authorization: `Bearer ${token}` },
            })
          ]);

          if (!tracksRes.ok || !artistsRes.ok) {
            throw new Error('Failed to fetch top data');
          }

          const [tracksData, artistsData] = await Promise.all([
            tracksRes.json(),
            artistsRes.json()
          ]);

          setTopTracks(tracksData.items);
          setTopArtists(artistsData.items);
        } catch (err) {
          console.error('Error fetching top data:', err);
          setError('Failed to fetch top tracks and artists');
        }
      };

      fetchTopData();
    }
  }, [router, searchParams, viewType]);

  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-8">Your Spotify Dashboard</h1>
      
      <div className="flex justify-center space-x-4 mb-8">
        <button
          onClick={() => setViewType('stats')}
          className={`px-4 py-2 rounded ${
            viewType === 'stats' ? 'bg-green-600' : 'bg-gray-700'
          }`}
        >
          Listening Stats
        </button>
        <button
          onClick={() => setViewType('top')}
          className={`px-4 py-2 rounded ${
            viewType === 'top' ? 'bg-green-600' : 'bg-gray-700'
          }`}
        >
          Top Tracks & Artists
        </button>
      </div>

      {viewType === 'stats' ? (
        <>
          <div className="flex justify-center space-x-4 mb-8">
            <button
              onClick={() => setTimeRange('day')}
              className={`px-4 py-2 rounded ${
                timeRange === 'day' ? 'bg-green-600' : 'bg-gray-700'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setTimeRange('week')}
              className={`px-4 py-2 rounded ${
                timeRange === 'week' ? 'bg-green-600' : 'bg-gray-700'
              }`}
            >
              This Week
            </button>
            <button
              onClick={() => setTimeRange('month')}
              className={`px-4 py-2 rounded ${
                timeRange === 'month' ? 'bg-green-600' : 'bg-gray-700'
              }`}
            >
              This Month
            </button>
          </div>
          <ListeningStats timeRange={timeRange} />
        </>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <section>
            <h3 className="text-2xl font-bold mb-4 text-green-400">Top Tracks</h3>
            <div className="space-y-4">
              {topTracks.map((track, index) => (
                <div
                  key={track.id}
                  className="flex items-center bg-gray-800 p-4 rounded-lg shadow-lg"
                >
                  <span className="text-xl font-bold text-gray-400 mr-4">
                    {index + 1}
                  </span>
                  <Image
                    src={track.album.images?.[0]?.url || "/default-album.png"}
                    alt={track.name}
                    width={64}
                    height={64}
                    className="w-16 h-16 rounded-lg mr-4"
                  />
                  <div>
                    <p className="font-semibold">{track.name}</p>
                    <p className="text-gray-400">
                      {track.artists.map((a) => a.name).join(", ")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-2xl font-bold mb-4 text-green-400">Top Artists</h3>
            <div className="space-y-4">
              {topArtists.map((artist, index) => (
                <div
                  key={artist.id}
                  className="flex items-center bg-gray-800 p-4 rounded-lg shadow-lg"
                >
                  <span className="text-xl font-bold text-gray-400 mr-4">
                    {index + 1}
                  </span>
                  <Image
                    src={artist.images?.[0]?.url || "/default-artist.png"}
                    alt={artist.name}
                    width={64}
                    height={64}
                    className="w-16 h-16 rounded-lg mr-4"
                  />
                  <div>
                    <p className="font-semibold">{artist.name}</p>
                    <p className="text-gray-400">
                      {artist.genres?.slice(0, 2).join(", ") || "Unknown"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default DashboardContent; 