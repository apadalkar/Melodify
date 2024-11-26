// src/app/api/callback/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    console.error('Authorization code missing');
    return NextResponse.redirect('/error?message=missing_code');
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    console.error('Environment variables are missing');
    return NextResponse.redirect('/error?message=server_error');
  }

  const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
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

  if (!tokenResponse.ok) {
    console.error('Token exchange failed');
    return NextResponse.redirect('/error?message=token_exchange_failed');
  }

  const tokenData = await tokenResponse.json();
  const accessToken = tokenData.access_token;

  return NextResponse.redirect(`/success?access_token=${accessToken}`);
}
