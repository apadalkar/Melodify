"use client"; 

import { useEffect, useState } from 'react';
import { fetchTopTracks } from './api/fetchtracks';

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
    const token = sessionStorage.getItem('spotify_access_token');
  
    if (token) {
      fetchTopTracks(token)
        .then((tracks: Track[]) => {
          setTopTracks(tracks);
        })
        .catch(() => {
          setError('Error fetching top tracks');
        });
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
