"use client";

import { useEffect, useState } from 'react';
import TopTracks from './TopTracks';

const Home = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuthentication = () => {
      const token = localStorage.getItem('spotify_access_token'); // Consistent with callback.ts
      setIsAuthenticated(!!token); // Set to true if token exists
    };

    checkAuthentication();
  }, []);

  const handleLogin = () => {
    window.location.href = '/api/login'; 
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-8">Welcome to Melodify</h1>
      {isAuthenticated ? (
        <>
          <h2 className="text-2xl mb-4">Your Top Tracks</h2>
          <TopTracks />
        </>
      ) : (
        <>
          <p className="text-xl mb-4">Please log in to see your metrics.</p>
          <button
            onClick={handleLogin}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Login with Spotify
          </button>
        </>
      )}
      {error && <div className="text-red-500 mt-4">{error}</div>}
    </main>
  );
};

export default Home;
