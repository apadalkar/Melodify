'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ListeningStats from './ListeningStats';

const DashboardContent = () => {
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('week');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('access_token') || localStorage.getItem('spotify_access_token');
    
    if (!token) {
      setError('Please log in to view your dashboard');
      router.push('/');
      return;
    }

    // Store the token if it came from the URL
    if (searchParams.get('access_token')) {
      localStorage.setItem('spotify_access_token', token);
    }
  }, [router, searchParams]);

  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-8">Your Listening Dashboard</h1>
      
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
    </div>
  );
};

export default DashboardContent; 