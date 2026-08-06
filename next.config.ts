import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Docker runner 단계에 .next/standalone 만 복사하기 위함 (Coolify 배포)
  output: "standalone",
};

export default nextConfig;
