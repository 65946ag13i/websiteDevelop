"use client";
import React from "react";
import "./globals.css"; // 全局样式
import Head from "next/head";
import WebsideHeader from "@/components/WebsideHeader";
import NavigationBar from "@/components/NavigationBar";
import { SessionProvider } from "next-auth/react";
const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <SessionProvider>
      <html lang="zh">
        <Head>
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
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <meta name="description" content="家庭電器" />
          <meta name="keywords" content="冷氣維修,家庭電器經銷商,冷氣清洗" />
          <title>111</title>
        </Head>
        <body>
          <header>
            <nav>
              <WebsideHeader></WebsideHeader>
              <NavigationBar></NavigationBar>
            </nav>
          </header>
          <main className="bg-pink-400 ">{children}</main>
          <footer>
            <p className="bg-blue-300 text-center p-1 text-base">
              Copyright © 2024
            </p>
          </footer>
        </body>
      </html>
    </SessionProvider>
  );
};

export default RootLayout;
