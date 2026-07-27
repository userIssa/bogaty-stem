/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/:path*',
        destination: 'https://genesisfeedback.netlify.app/ecommerce/online/feedback',
        permanent: false,
      },
    ];
  },
};
module.exports = nextConfig;
