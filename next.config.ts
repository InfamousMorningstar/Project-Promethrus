import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Founder photo is served from the portfolio so both sites stay in sync.
    remotePatterns: [{ protocol: "https", hostname: "portfolio.ahmxd.net", pathname: "/images/**" }],
  },
};

export default nextConfig;
