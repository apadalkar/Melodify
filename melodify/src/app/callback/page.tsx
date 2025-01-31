'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Callback = () => {
  const router = useRouter();

  useEffect(() => {
    const getToken = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');

      if (code) {
        const response = await fetch('/api/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code }),
        });

        if (response.ok) {
          const { access_token } = await response.json();
          localStorage.setItem('spotify_access_token', access_token);
          router.push('/dashboard'); // Redirect to the dashboard
        } else {
          console.error('Failed to exchange token');
          router.push('/error'); // Redirect to an error page if needed
        }
      } else {
        console.error('Authorization code not found');
        router.push('/error');
      }
    };

    getToken();
  }, [router]); 

  return <div>Authenticating...</div>;
};

export default Callback;
