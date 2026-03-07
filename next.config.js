/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['files.catbox.moe', 'uguu.se', 'a.uguu.se', 'your-project.supabase.co'],
    remotePatterns: [
      { protocol: 'https', hostname: '**.supabase.co' },
      { protocol: 'https', hostname: 'files.catbox.moe' },
      { protocol: 'https', hostname: '**.uguu.se' },
    ],
  },
  api: {
    bodyParser: false,
  },
};

module.exports = nextConfig;
