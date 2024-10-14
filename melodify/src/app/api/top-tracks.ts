import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Replace this with the actual method to get the authorization token
  const token = 'YOUR_SPOTIFY_ACCESS_TOKEN';

  const response = await fetch('https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=5', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.ok) {
    const data = await response.json();
    res.status(200).json(data);
  } else {
    res.status(response.status).json({ error: 'Failed to fetch top tracks' });
  }
}