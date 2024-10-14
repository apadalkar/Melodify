'use client';

import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = () => {
    router.push('/api/login');
  };

  return (
    <div>
      <h1>Login to Spotify</h1>
      <button onClick={handleLogin}>Login with Spotify</button>
    </div>
  );
}