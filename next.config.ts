import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "app.zenithlifebd.com",
                pathname: "/**", // 👈 allows all paths from that domain
            },
        ],
    },
};

export default nextConfig;
