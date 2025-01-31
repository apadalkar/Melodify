"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type UserProfile = {
  display_name: string;
  images: { url: string }[];
};

type Track = {
  id: string;
  name: string;
  album: {
    images: { url: string }[];
  };
  artists: { name: string }[];
};

type Artist = {
  id: string;
  name: string;
  images: { url: string }[];
  genres: string[];
};

const Dashboard = () => {
  const [topTracks, setTopTracks] = useState<Track[]>([]);
  const [topArtists, setTopArtists] = useState<Artist[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSpotifyData = async () => {
      const accessToken = new URLSearchParams(window.location.search).get(
        "access_token"
      );

      if (!accessToken) {
        setError("No access token found.");
        return;
      }

      try {
        const profileResponse = await fetch("https://api.spotify.com/v1/me", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const profileData: UserProfile = await profileResponse.json();

        const tracksResponse = await fetch(
          "https://api.spotify.com/v1/me/top/tracks",
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        const tracksData = await tracksResponse.json();
        setTopTracks(tracksData.items as Track[]);

        const artistsResponse = await fetch(
          "https://api.spotify.com/v1/me/top/artists",
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        const artistsData = await artistsResponse.json();
        setTopArtists(artistsData.items as Artist[]);

        setUserProfile(profileData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch data. Please try again.");
      }
    };

    fetchSpotifyData();
  }, []);

  if (error) {
    return <div className="text-red-500 text-center mt-10">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white flex flex-col items-center">
      {/* Header Section */}
      <header className="flex-grow px-6 py-10 text-center">
        {userProfile && (
          <div className="flex flex-col items-center">
            <Image
              src={userProfile?.images?.[0]?.url || "/default-profile.png"}
              alt={userProfile?.display_name || "Unknown User"}
              width={160}
              height={160}
              className="w-40 h-40 rounded-full mx-auto mb-4"
            />
            <h1 className="text-4xl font-bold text-green-400">
              Welcome, {userProfile?.display_name}.
            </h1>
          </div>
        )}
      </header>

      <h2 className="text-5xl font-extrabold mb-10 text-center text-green-400">
        Your Spotify Insights.
      </h2>

      {/* Dashboard Content */}
      <main className="px-6 py-6 w-full max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Top Tracks Section */}
          <section>
            <h3 className="text-2xl font-bold mb-4 text-green-400">
              Top Tracks
            </h3>
            <div className="space-y-4">
              {topTracks.map((track, index) => (
                <div
                  key={track.id}
                  className="flex items-center bg-gray-800 p-4 rounded-lg shadow-lg"
                >
                  <span className="text-xl font-bold text-gray-400 mr-4">
                    {index + 1}
                  </span>
                  <Image
                    src={track.album.images[0]?.url || "/default-album.png"}
                    alt={track.name}
                    width={64}
                    height={64}
                    className="w-16 h-16 rounded-lg mr-4"
                  />
                  <div>
                    <p className="font-semibold">{track.name}</p>
                    <p className="text-gray-400">
                      {track.artists
                        .map((artist: { name: string }) => artist.name)
                        .join(", ")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Top Artists Section */}
          <section>
            <h3 className="text-2xl font-bold mb-4 text-green-400">
              Top Artists
            </h3>
            <div className="space-y-4">
              {topArtists.map((artist, index) => (
                <div
                  key={artist.id}
                  className="flex items-center bg-gray-800 p-4 rounded-lg shadow-lg"
                >
                  <span className="text-xl font-bold text-gray-400 mr-4">
                    {index + 1}
                  </span>
                  <Image
                    src={artist.images[0]?.url || "/default-artist.png"}
                    alt={artist.name}
                    width={64}
                    height={64}
                    className="w-16 h-16 rounded-lg mr-4"
                  />
                  <div>
                    <p className="font-semibold">{artist.name}</p>
                    <p className="text-gray-400">
                      {artist.genres?.slice(0, 2).join(", ") || "Unknown"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-6">
        <p className="text-gray-500">Melodify</p>
      </footer>
    </div>
  );
};

export default Dashboard;
