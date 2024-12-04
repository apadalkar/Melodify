"use client";

import React from "react";

const Login = () => {
  const handleLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
    const redirectUri = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI;

    // Debugging environment variables
    console.log("NEXT_PUBLIC_SPOTIFY_CLIENT_ID:", clientId);
    console.log("NEXT_PUBLIC_SPOTIFY_REDIRECT_URI:", redirectUri);

    if (!clientId || !redirectUri) {
      console.error("Environment variables are missing.");
      alert("Missing environment variables. Please check your configuration.");
      return;
    }

    const scopes = "user-read-private user-read-email user-top-read";

    const authUrl = `https://accounts.spotify.com/authorize?` +
      `response_type=code&` +
      `client_id=${clientId}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `scope=${encodeURIComponent(scopes)}`;

    console.log("Auth URL:", authUrl); // Debugging auth URL

    window.location.href = authUrl; // Redirect to Spotify login
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h2 className="text-2xl font-bold mb-4">Login to Spotify</h2>
      <button
        onClick={handleLogin}
        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-4 focus:ring-green-300"
      >
        Login with Spotify
      </button>
    </div>
  );
};

export default Login;
