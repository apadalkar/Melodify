/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
      SPOTIFY_CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET,
      NEXT_PUBLIC_SPOTIFY_CLIENT_ID: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID,
      NEXT_PUBLIC_SPOTIFY_REDIRECT_URI: process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI,
    },
    output: "standalone", 
    experimental: {
    appDir: true, 
  },
    images: {
      domains: ["i.scdn.co"], 
    },
  };
  
  export default nextConfig;
  
  