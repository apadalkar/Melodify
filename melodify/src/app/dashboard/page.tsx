'use client';

import { useEffect, useState } from 'react';
import ListeningStats from '../components/ListeningStats';

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('week');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('spotify_access_token');
    if (!token) {
      setError('Please log in to view your dashboard');
    }
  }, []);

  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white p-6">
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
    </div>
  );
};

export default Dashboard;
