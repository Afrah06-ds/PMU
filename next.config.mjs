/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  experimental: {
    serverComponentsExternalPackages: ['@supabase/supabase-js', '@supabase/ssr', 'pdfjs-dist'],
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'iceberg-js': false,
    };
    return config;
  },
};

export default nextConfig;




