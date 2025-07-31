import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  if (!code) {
    console.error("Authorization code is missing.");
    return NextResponse.redirect(`${baseUrl}/error?message=missing_code`);
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI || "http://localhost:3000/api/callback";

  if (!clientId || !clientSecret || !redirectUri) {
    console.error("Environment variables are missing.");
    return NextResponse.redirect(`${baseUrl}/error?message=server_error`);
  }

  const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Basic " + Buffer.from(`${clientId}:${clientSecret}`).toString("base64"),
    },
    body: new URLSearchParams({
      code,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });

  const tokenData = await tokenResponse.json();

  if (!tokenResponse.ok) {
    console.error("Token exchange failed:", tokenData);
    return NextResponse.redirect(`${baseUrl}/error?message=token_exchange_failed`);
  }

  const accessToken = tokenData.access_token;
  if (!accessToken) {
    console.error("No access token in response:", tokenData);
    return NextResponse.redirect(`${baseUrl}/error?message=no_access_token`);
  }

  return NextResponse.redirect(`${baseUrl}/dashboard?access_token=${accessToken}`);
}
