// src/app/callback.ts
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Callback = () => {
  const router = useRouter();

  useEffect(() => {
    const getToken = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const state = params.get('state'); // You can handle state if you implemented it

      if (code) {
        const response = await fetch('/api/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code }),
        });

        if (response.ok) {
          const data = await response.json();
          // Save the access token in localStorage or state
          localStorage.setItem('access_token', data.access_token);
          router.push('/'); // Redirect to home or wherever you want
        } else {
          console.error('Failed to retrieve access token');
        }
      }
    };

    getToken();
  }, []);

  return <div>Loading...</div>; // You can customize this loading UI
};

export default Callback;
