import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "picsum.photos" },
    ],
  },
  sassOptions: {
    includePaths: [path.join(process.cwd(), "styles")],
    loadPaths: [path.join(process.cwd(), "styles")],
  },
};

export default nextConfig;
