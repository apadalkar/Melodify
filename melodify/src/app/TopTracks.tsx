// src/app/TopTracks.tsx
"use client"; // <-- This should be the first line

import { useEffect, useState } from 'react';
import { fetchTopTracks } from './api/fetchtracks';

const TopTracks = () => {
  const [topTracks, setTopTracks] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = sessionStorage.getItem('spotify_access_token');

    if (token) {
      const getTopTracks = async () => {
        try {
          const tracks = await fetchTopTracks(token);
          setTopTracks(tracks);
        } catch (err) {
          setError('Error fetching top tracks');
        }
      };

      getTopTracks();
    }
  }, []);

  return (
    <div>
      {error && <div className="text-red-500">{error}</div>}
      <h3 className="text-xl">Your Top Tracks:</h3>
      <ul>
        {topTracks.map((track) => (
          <li key={track.id}>
            {track.name} by {track.artists.map(artist => artist.name).join(', ')}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopTracks;