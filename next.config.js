/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  async redirects() {
    return [
      { source: '/buy',      destination: '/?panel=buy',      permanent: false },
      { source: '/story',    destination: '/?panel=story',    permanent: false },
      { source: '/wipepaper',destination: '/?panel=wipepaper',permanent: false },
      { source: '/chart',    destination: '/?panel=chart',    permanent: false },
      { source: '/contact',  destination: '/?panel=contact',  permanent: false },
    ];
  },
};

module.exports = nextConfig;
