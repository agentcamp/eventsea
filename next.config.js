/** @type {import('next').NextConfig} */
const nextConfig = {
  // We don't need to specify NEXT_PUBLIC_ variables in env as they are automatically
  // available to the browser. Only add non-NEXT_PUBLIC_ variables here if needed.
  images: {
    domains: ['fdgwgahxwobvovkebcew.supabase.co', 'avatars.githubusercontent.com'],
  },
  // Enable experimental features if needed
  experimental: {
    serverActions: true,
  }
}

module.exports = nextConfig 