import "./globals.css";
import React from "react";
// import Head from "next/head";
import WebsideHeader from "@/components/WebsideHeader";
import NavigationBar from "@/components/NavigationBar";
import UploadState from "@/components/UploadState";
import { ReactNode } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/appRouter/api/auth/auth-config";

import { SessionProvider } from "@/components/SessionProvider/SessionProvider";

import { AllProviders } from "@/components/AllProvider/AllProviders";

export const metadata = {
  title: "建豐電器有限公司",
  description: "家庭電器",
  keywords: "冷氣維修,家庭電器經銷商,冷氣清洗",
};

export const viewport = {
  width: "device-width",
  initialScale: 1.0,
};

interface ReduxProviderProps {
  children: ReactNode;
}

const RootLayout = async ({ children }: ReduxProviderProps) => {
  const session = await getServerSession(authOptions);

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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@100..900&display=swap"
        />
      </head>
      <body>
        <AllProviders>
          <SessionProvider session={session}>
            <nav>
              <WebsideHeader></WebsideHeader>
              <NavigationBar></NavigationBar>
            </nav>
            <main className="bg-gray-100 w-full flex justify-center">
              {children}
            </main>
            <footer>
              <p className="bg-blue-300 text-center p-1 text-base">
                Copyright © 2024
              </p>
            </footer>

            <UploadState />
          </SessionProvider>
        </AllProviders>
      </body>
    </html>
  );
};

export default RootLayout;
