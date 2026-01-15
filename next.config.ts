import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  /* 开发阶段内网跨域问题 */
  allowedDevOrigins: ['192.168.*.*'],
  /* 静态模式模式、指定输出文件、关闭图片优化 */
  output: 'export',
  distDir: 'out',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
