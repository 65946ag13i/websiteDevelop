/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // 1. Webpack 自定義處理
  webpack: (config, { isServer }) => {
    // 處理原生模組外部化，避免 Webpack 嘗試在瀏覽器端打包後端套件
    if (isServer) {
      config.externals = [
        ...(config.externals || []),
        {
          'react-native-sqlite-storage': 'commonjs react-native-sqlite-storage',
          '@sap/hana-client': 'commonjs @sap/hana-client',
          // 如果你的 pg 或 sqlite3 有報錯，也可以加在這裡
        },
      ];
    }

    // 2. SVG 支持
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },

  // 3. 圖片配置 (移除 domains 統一使用 remotePatterns)
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/api/**',
      },
    ],
  },

  // 4. 構建設定
  eslint: {
    // 既然你已經設定了 Prettier/ESLint 警告，開發時處理即可，構建時可忽略以加快速度
    ignoreDuringBuilds: true,
  },

  // 5. 優化 (針對 Next.js 15)
  experimental: {
    // 幫你把常用的 MUI 和 Heroicons 加入優化列表
    optimizePackageImports: ['@mui/material', '@heroicons/react', 'lodash-es'],
  },
};

export default nextConfig;
