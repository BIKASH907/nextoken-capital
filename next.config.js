/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['supabase.co', 'your-project.supabase.co'],
  },
  env: {
    NEXT_PUBLIC_APP_NAME: 'Nextoken Capital',
    NEXT_PUBLIC_APP_VERSION: '1.0.0',
  },
}

module.exports = nextConfig
