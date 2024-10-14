import { NextResponse } from 'next/server';
import fetch from 'node-fetch'; // You might need to install node-fetch if it's not installed

export async function POST() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!tokenResponse.ok) {
    return NextResponse.json({ error: 'Failed to fetch token' }, { status: 500 });
  }

  const data = await tokenResponse.json();
  return NextResponse.json(data);
}
