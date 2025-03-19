import { NextResponse } from 'next/server';

export async function GET() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI;
  const scopes = 'user-read-private user-read-email user-top-read user-read-recently-played';

  if (!clientId || !redirectUri) {
    console.error('Missing environment variables.');
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  const authUrl = `https://accounts.spotify.com/authorize?` +
    `response_type=code&` +
    `client_id=${clientId}&` +
    `redirect_uri=${encodeURIComponent(redirectUri)}&` +
    `scope=${encodeURIComponent(scopes)}`;

  return NextResponse.redirect(authUrl);
}
