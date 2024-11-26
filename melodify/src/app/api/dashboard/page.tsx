'use client';

import { useEffect, useState } from 'react';

const Dashboard = () => {
  const [metrics, setMetrics] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      const token = localStorage.getItem('spotify_access_token');

      if (!token) {
        setError('User not authenticated');
        return;
      }

      try {
        const response = await fetch('/api/top-tracks', {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          setMetrics(data);
        } else {
          setError('Failed to fetch metrics');
        }
      } catch (err) {
        console.error(err);
        setError('An error occurred');
      }
    };

    fetchMetrics();
  }, []);

  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Your Metrics</h1>
      {metrics ? (
        <ul>
          {metrics.topTracks.map((track: any, index: number) => (
            <li key={index}>
              {track.name} by {track.artist} - {track.plays} plays
            </li>
          ))}
        </ul>
      ) : (
        <p>Loading metrics...</p>
      )}
    </div>
  );
};

export default Dashboard;
