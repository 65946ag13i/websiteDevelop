// next.config.mjs
export default {
  webpack: (config, { isServer }) => {
    // 保留你的原生模块配置
    config.externals = config.externals || [];
    config.externals.push({
      "react-native-sqlite-storage": "commonjs react-native-sqlite-storage",
      "@sap/hana-client": "commonjs @sap/hana-client",
    });

    // 添加对 SVG 的支持（如果需要）
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },
  images: {
    domains: ["localhost"], // 添加localhost到允许的主机名
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/api/**",
      },
    ],
  },
  // 启用 React 严格模式
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true, // 构建时暂时忽略 ESLint
  },
  // 优化第三方包导入（Next.js 15 新特性）
  experimental: {
    optimizePackageImports: ["@heroicons/react", "lodash-es"],
  },
};
