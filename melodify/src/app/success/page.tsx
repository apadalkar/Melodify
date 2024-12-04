"use client";

import { useEffect, useState } from "react";

const Dashboard = () => {
  const [topTracks, setTopTracks] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [error, setError] = useState(null);

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
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const profileData = await profileResponse.json();

        const tracksResponse = await fetch(
          "https://api.spotify.com/v1/me/top/tracks",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const tracksData = await tracksResponse.json();

        const artistsResponse = await fetch(
          "https://api.spotify.com/v1/me/top/artists",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const artistsData = await artistsResponse.json();

        setUserProfile(profileData);
        setTopTracks(tracksData.items);
        setTopArtists(artistsData.items);
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
    <div className="min-h-screen bg-gradient-to-br from-green-500 via-transparent to-green-500 text-white">
      {/* Header Section */}
      <header className="px-6 py-12 text-center">
        {userProfile && (
          <div>
            <img
              src={userProfile.images[0]?.url}
              alt={userProfile.display_name}
              className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-green-500"
            />
            <h1 className="text-4xl font-bold">
              Welcome, {userProfile.display_name}
            </h1>
            <p className="text-gray-300 mt-2">
              Followers: {userProfile.followers.total}
            </p>
          </div>
        )}
      </header>

      {/* Dashboard Content */}
      <main className="px-6 py-12">
        <h2 className="text-3xl font-bold mb-8 text-center">
          Your Spotify Insights
        </h2>
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
                  className="flex items-center bg-gray-800 p-4 rounded-lg"
                >
                  <span className="text-xl font-bold text-gray-400 mr-4">
                    {index + 1}
                  </span>
                  <img
                    src={track.album.images[0]?.url}
                    alt={track.name}
                    className="w-16 h-16 rounded-lg mr-4"
                  />
                  <div>
                    <p className="font-semibold">{track.name}</p>
                    <p className="text-gray-400">
                      {track.artists.map((artist) => artist.name).join(", ")}
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
                  className="flex items-center bg-gray-800 p-4 rounded-lg"
                >
                  <span className="text-xl font-bold text-gray-400 mr-4">
                    {index + 1}
                  </span>
                  <img
                    src={artist.images[0]?.url}
                    alt={artist.name}
                    className="w-16 h-16 rounded-lg mr-4"
                  />
                  <div>
                    <p className="font-semibold">{artist.name}</p>
                    <p className="text-gray-400">
                      {artist.genres.slice(0, 2).join(", ")}
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
        <p className="text-gray-500">
          Built with ❤️ and Spotify's API | Melodify
        </p>
      </footer>
    </div>
  );
};

export default Dashboard;
