// src/lib/fetchtracks.ts

export const fetchTopTracks = async (token: string) => {
    const response = await fetch('https://api.spotify.com/v1/me/top/tracks?limit=10', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  
    if (!response.ok) {
      throw new Error('Failed to fetch top tracks');
    }
  
    const data = await response.json();
    return data.items; // Return the top tracks
  };
  