"use client"; 

import { useEffect, useState } from 'react';
import { fetchTopTracks } from '@/lib/fetchTracks';

// Define a type for track objects
type Track = {
  id: string;
  name: string;
  artists: { name: string }[];
};

const TopTracks = () => {
  const [topTracks, setTopTracks] = useState<Track[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('spotify_access_token');
  
    if (!token) {
      setError('Please log in to view your top tracks');
      return;
    }

    fetchTopTracks(token)
      .then((tracks: Track[]) => {
        setTopTracks(tracks);
      })
      .catch((error) => {
        console.error('Error fetching top tracks:', error);
        setError('Failed to fetch top tracks. Please try logging in again.');
        // Clear invalid token
        localStorage.removeItem('spotify_access_token');
      });
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
