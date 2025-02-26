/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_SECRET: process.env.SUPABASE_SERVICE_ROLE_SECRET,
    NEXT_PUBLIC_GITHUB_OAUTH_CLIENT_ID: process.env.NEXT_PUBLIC_GITHUB_OAUTH_CLIENT_ID,
    NEXT_PUBLIC_SITE_ORIGIN: process.env.NEXT_PUBLIC_SITE_ORIGIN,
  },
  images: {
    domains: ['styjswjyforpnjhgqdse.supabase.co'], // Add your Supabase domain for image hosting
  },
}

module.exports = nextConfig 