/** @type {import('next').NextConfig} */

const withPWA = require('next-pwa')({
  dest: 'public',
})

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    customKey: 'my-value',
  },
};


module.exports = withPWA({
  nextConfig
})

