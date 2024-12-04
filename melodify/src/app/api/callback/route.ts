import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');


  if (!code) {
    console.error('Authorization code is missing.');
    return NextResponse.redirect('http://localhost:3000/error?message=missing_code');
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI || 'http://localhost:3000/api/callback';


  if (!clientId || !clientSecret || !redirectUri) {
    console.error('Environment variables are missing.');
    return NextResponse.redirect('http://localhost:3000/error?message=server_error');
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

  const tokenData = await tokenResponse.json();


  if (!tokenResponse.ok) {
    console.error('Token exchange failed:', tokenData);
    return NextResponse.redirect('http://localhost:3000/error?message=token_exchange_failed');
  }

  const accessToken = tokenData.access_token;

  // Use absolute URL for redirection
  return NextResponse.redirect(`http://localhost:3000/success?access_token=${accessToken}`);
}
