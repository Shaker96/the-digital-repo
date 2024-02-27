/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["cdn.sanity.io"],
  },
  experimental: {
    appDir: true,
  },
  future: { webpack5: true },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
      config.resolve.alias.canvas = false
      config.resolve.alias.encoding = false
      return config
  }
}

module.exports = nextConfig
