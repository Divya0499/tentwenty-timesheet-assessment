import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root to this project so Next doesn't try to infer it
  // from a lockfile elsewhere on disk (this folder isn't the git repo root).
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
