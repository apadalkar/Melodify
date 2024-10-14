import { NextResponse } from 'next/server';

export async function GET() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI;
  const scope = 'user-read-private user-read-email user-top-read';

  if (!clientId || !redirectUri) {
    console.error('Missing SPOTIFY_CLIENT_ID or SPOTIFY_REDIRECT_URI');
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  const state = Math.random().toString(36).substring(7);

  const authUrl = new URL('https://accounts.spotify.com/authorize');
  authUrl.searchParams.append('client_id', clientId);
  authUrl.searchParams.append('response_type', 'code');
  authUrl.searchParams.append('redirect_uri', redirectUri);
  authUrl.searchParams.append('state', state);
  authUrl.searchParams.append('scope', scope);

  return NextResponse.redirect(authUrl.toString());
}