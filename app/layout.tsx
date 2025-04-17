import React from "react";
import "./globals.css"; // 全局样式
// import Head from "next/head";
import WebsideHeader from "@/components/WebsideHeader";
import NavigationBar from "@/components/NavigationBar";
import { ReduxProvider } from "@/components/ReduxProvider/ReduxProvider";
import { ReactNode } from "react";

export const metadata = {
  title: "建豐電器有限公司",
  description: "家庭電器",
  keywords: "冷氣維修,家庭電器經銷商,冷氣清洗",
  charset: "UTF-8", // 設置字符集
  links: [
    {
      rel: "preconnect",
      href: "https://fonts.googleapis.com",
    },
    {
      rel: "preconnect",
      href: "https://fonts.gstatic.com",
      crossOrigin: "anonymous",
    },
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@100..900&display=swap",
    },
  ],
};

export const viewport = {
  width: "device-width",
  initialScale: 1.0,
};

interface ReduxProviderProps {
  children: ReactNode;
  initialState?: any; // 初始狀態（可選）
}

const RootLayout = ({ children, initialState }: ReduxProviderProps) => {
  return (
    <html lang="zh">
      {/* <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@100..900&display=swap"
          rel="stylesheet"
        />
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        //content="width=device-width"：設定視口的寬度與裝置的螢幕寬度相同，確保頁面不會預設縮小。
        <meta name="description" content="家庭電器" />
        <meta name="keywords" content="冷氣維修,家庭電器經銷商,冷氣清洗" />
        <title>建豐電器有限公司</title>
      </Head> */}
      <body>
        {/* <SessionProvider> */}
        <ReduxProvider>
          <header>
            <nav>
              <WebsideHeader></WebsideHeader>
              <NavigationBar></NavigationBar>
            </nav>
          </header>
          <main className="bg-gray-100 w-full flex justify-center">
            {children}
          </main>
          <footer>
            <p className="bg-blue-300 text-center p-1 text-base">
              Copyright © 2024
            </p>
          </footer>
          {/* </SessionProvider> */}
        </ReduxProvider>
      </body>
    </html>
  );
};

export default RootLayout;
