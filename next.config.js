/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    compiler: {
        styledComponents: {
          displayName: false,
        },
      },
}

module.exports = nextConfig
