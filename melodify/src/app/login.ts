// src/app/login.ts
"use client"; // This should be the first line

import React from 'react';

const Login = () => {
  const handleLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID; // Ensure this is defined in .env.local
    const redirectUri = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI; // Ensure this is defined in .env.local
    const scopes = 'user-read-private user-read-email user-top-read'; // Add any other scopes you need

    const authUrl = `https://accounts.spotify.com/authorize?` +
      `response_type=code&` +
      `client_id=${clientId}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `scope=${encodeURIComponent(scopes)}`;

    window.location.href = authUrl; // Redirect to Spotify for authentication
  };

  return (
    <div>
      <h2>Login to Spotify</h2>
      <button onClick={handleLogin}>Login with Spotify</button> {/* Fixed typo here */}
    </div>
  );
};

export default Login;
