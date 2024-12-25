/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["placehold.co", "www.b2sign.com"],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
