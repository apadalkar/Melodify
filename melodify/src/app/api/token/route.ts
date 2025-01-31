import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { code } = await request.json();
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI || 'http://localhost:3000/api/callback';

  // Debugging environment variables and received code
  console.log('SPOTIFY_CLIENT_ID:', clientId);
  console.log('SPOTIFY_CLIENT_SECRET:', clientSecret);
  console.log('SPOTIFY_REDIRECT_URI:', redirectUri);
  console.log('Received code:', code);

  if (!clientId || !clientSecret || !redirectUri) {
    console.error('Environment variables are missing.');
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64'),
    },
    body: new URLSearchParams({
      code,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }),
  });

  const responseText = await response.text();
  console.log('Spotify Response:', responseText); // Debugging

  if (!response.ok) {
    console.error('Token exchange failed:', responseText);
    return NextResponse.json({ error: 'Token exchange failed' }, { status: 400 });
  }

  const data = JSON.parse(responseText);
  return NextResponse.json({ access_token: data.access_token });
}
