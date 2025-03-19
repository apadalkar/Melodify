"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const Home = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [error] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuthentication = () => {
      const token = localStorage.getItem('spotify_access_token');
      if (token) {
        setIsAuthenticated(true);
        router.push('/dashboard');
      }
    };

    checkAuthentication();
  }, [router]);

  const handleLogin = () => {
    window.location.href = '/api/login'; 
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
      <h1 className="text-4xl font-bold mb-8">Welcome to Melodify</h1>
      {!isAuthenticated && (
        <>
          <p className="text-xl mb-4">Please log in to see your listening statistics.</p>
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
