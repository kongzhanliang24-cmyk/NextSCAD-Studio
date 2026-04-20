const isProd = process.env.NODE_ENV === 'production'
const basePath = isProd ? '/NextSCAD-Studio' : ''

const nextConfig = {
  output: 'export',
  basePath,
  images: { unoptimized: true },
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath
  },
  experimental: {
    optimizePackageImports: ['lucide-react']
  }
}

export default nextConfig
