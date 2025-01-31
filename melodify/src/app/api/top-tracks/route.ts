import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return NextResponse.json({ error: 'No access token provided' }, { status: 401 });
  }

  const response = await fetch('https://api.spotify.com/v1/me/top/tracks', {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('Failed to fetch top tracks:', error);
    return NextResponse.json({ error: 'Failed to fetch top tracks' }, { status: 400 });
  }

  const data = await response.json();
  return NextResponse.json({ topTracks: data.items });
}
