/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack']
    })
    return config
  },
  output: 'standalone',
  async rewrites() {
    const SIGNIN_URL = process.env.NEXT_PUBLIC_SIGNIN_URL
    return [
      {
        source: '/signin/:path*',
        destination: `${SIGNIN_URL}/auth/signin/:path*`
      },
      {
        source: '/signout',
        destination: `${SIGNIN_URL}/auth/signout`
      },
      {
        source: '/otp/:path*',
        destination: `${SIGNIN_URL}/otp/:path*`
      },
      {
        source: '/set-cookies/:path*',
        destination: `${SIGNIN_URL}/set-cookies/:path*`
      }
    ]
  }
}
export default nextConfig
