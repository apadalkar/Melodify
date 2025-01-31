//api/callback.ts
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Callback = () => {
  const router = useRouter();

  useEffect(() => {
    const getToken = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');

        if (!code) {
          console.error('Authorization code not found');
          router.push('/error');
          return;
        }

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
          router.push('/error'); // Redirect to an error page
        }
      } catch (err) {
        console.error('Error during token exchange:', err);
        router.push('/error');
      }
    };

    getToken();
  }, [router]); // Added `router` as a dependency

};

export default Callback;
