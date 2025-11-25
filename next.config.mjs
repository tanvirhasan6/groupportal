/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "app.zenithlifebd.com",
        pathname: "/**", // 👈 allows all paths from that domain
      },
    ],
  },
  output: "standalone",
};

export default nextConfig;
