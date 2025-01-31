"use client";

import { useRouter } from "next/navigation";
import React from "react";

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = () => {
    router.push("/api/login"); // Ensure this API route exists
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
}
