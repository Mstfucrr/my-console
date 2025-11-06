/** @type {import('next').NextConfig} */
const nextConfig = {
  typedRoutes: true,
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack']
    })
    return config
  },
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js'
      }
    }
  },
  output: 'standalone'
}
export default nextConfig
