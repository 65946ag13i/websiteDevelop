# 網頁啟動

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

# 前言

這是我在學習完網路課程後發現內容太少，所以直接製作一個網頁，了解網站需要的各種功能

由於是第一次練習網頁，在寫完後才發現，功能上有的難以維護，時間不夠修改，所以以練習基礎功能為目標

在網頁配色上本來想以修改配色，順便練習字體、背景配色功能，但發現不如不配色以白底黑字更耐看

所以網頁上的配色一樣練習為主

前後端代碼目前無法記下所有參數選項，還需要參考筆記

# 網頁基本說明

1. 建立一個我家電器行簡易網站
2. 提供各產品的線上報修及服務站網址
3. 提供一個簡易的估價單表單提交、表單查詢、修改密碼、登出等功能
4. 建立一個冷氣髒污圖片輪播圖

# 前後端功能說明

以Next.js +TailwindCss製作網站，並練習 React 框架，並簡易理解插件功能使用方法

在網路課程有練習過Express(只知道基本操作沒有深入練習) ， 但後端主要以Nextjs提供的後端為主要練習(後面發現Express，生態比較好)

目前再使用typescript 時 不知道該使用哪個DOM type

## 前端功能實作

1.  首頁

        - 練習基本HTML標籤、位置定位

    [首頁](http://localhost:3000/)

2.  Card 樣板

        -  簡易實現卡片樣板、flex box

    [維修](http://localhost:3000/repair)

3.  輪播圖

        -  實現無縫輪播圖

    [圖片案例](http://localhost:3000/example)

4.  簡易報價

         完成以下
          - checkBox 選擇
          - 難維護的循環嵌套顯示圖片及圖片儲存
            - 使用fileReader 獲取base64 URL 顯示圖片
            - 使用canvus 將非jpge 轉換為jpge 後儲存為blob準備後續上傳
          - useeffect 坪數計算機
          - 簡易的textarea
          - 圖片分片上傳
          - Redux toolkit 控制上傳模塊
          - 使用 react dialog 模組 完成dialog
          - 使用 React-query 讀取資料並快取
          - React 組件切換

    [報價實作](http://localhost:3000/quote)

5.  註冊與登入

         註冊頁面完成以下
         - Regex 信箱驗證
         - input 驗證錯誤抖動animate
         - 傳送到後端寄出驗證信

    [註冊](http://localhost:3000/register)

        登入頁面完成以下
        -Regex 信箱驗證
        -NextJS 內建 Google OAuth 2.0 登入

    [登入](http://localhost:3000/signin)

6.  使用material和react-icons 完成部分圖標

## 後端功能實作

### 完成以下以下

1.  nextjs AUTH

    ```md
    - 完成auth-config -自定義登入驗證功能
    - google oauth 2 驗證設置
    - 以及nextjs 後端練習
    ```

2.  使用bcrypt雜湊驗證密碼
3.  postgreSQL
4.  typeORM

    ```md
    - 建立SQL實體
    - 使用typeORM完成CRUD
    - 使用class-validator驗證錯誤
    - 想簡單練習後端，所以沒有使用DTO 分別驗證資料
    ```

5.  Google oauth2 (JWT token)
6.  bcrypt
7.  簡易圖片分片接收、合併並儲存到系統
8.  nodemailer

    ```md
    - 使用google Mail 寄送驗證信
    ```

9.  使用ai 建立postgre的docker鏡像檔

    使用 pg_partman 和 pg_cron 進行分區刪除註冊驗證碼

    ```yaml
    services:
    postgres:
    build:
    context: .
    dockerfile: Dockerfile
    container_name: postgres_partman_cron
    environment:
    POSTGRES_USER: ${POSTGRES_USER}
    POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    POSTGRES_DB: ${POSTGRES_DB}
    volumes:
    - postgres_data:/var/lib/postgresql/data
    - ./postgresql.conf:/etc/postgresql/postgresql.conf
    - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
    - "5439:5432"
    networks:
    - postgres-network
    command: ["postgres", "-c", "config_file=/etc/postgresql/postgresql.conf"]

    networks:
    postgres-network:
    driver: bridge

    volumes:
    postgres_data:
    driver: local
    ```

    ```sql
    -- 啟用 pg_partman 擴展
    CREATE EXTENSION IF NOT EXISTS pg_partman;

    -- 啟用 pg_cron 擴展
    CREATE EXTENSION IF NOT EXISTS pg_cron;

    ```
