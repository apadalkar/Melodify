import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');

    console.log('Received code:', code);
    console.log('Received state:', state);

    if (!code) {
      console.error('No code received from Spotify');
      return NextResponse.redirect('/error?message=missing_code');
    }

    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
    const redirectUri = process.env.SPOTIFY_REDIRECT_URI;

    console.log('Client ID:', clientId);
    console.log('Redirect URI:', redirectUri);

    if (!clientId || !clientSecret || !redirectUri) {
      console.error('Missing environment variables');
      return NextResponse.redirect('/error?message=server_error');
    }

    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64')
      },
      body: new URLSearchParams({
        code: code,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code'
      })
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error('Token exchange failed:', errorData);
      return NextResponse.redirect('/error?message=token_exchange_failed');
    }

    const tokenData = await tokenResponse.json();
    console.log('Token data received');

    return NextResponse.redirect('/success?access_token=' + tokenData.access_token);
  } catch (error) {
    console.error('Callback error:', error);
    return NextResponse.redirect('/error?message=server_error');
  }
}