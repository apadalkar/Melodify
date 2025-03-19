import { Suspense } from 'react';
import DashboardContent from '../components/DashboardContent';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white p-6">
      <Suspense fallback={<div className="text-center">Loading dashboard...</div>}>
        <DashboardContent />
      </Suspense>
    </div>
  );
}
