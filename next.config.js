/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['quanlyhethong-staging.tienichlinhduong.com', 'bach-hoa-viet.s3.ap-southeast-1.amazonaws.com'],
  },
};

module.exports = nextConfig;
