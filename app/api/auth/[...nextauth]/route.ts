// pages/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { User } from "@/backend/entities/User"; // 引入 User 實體
import { initDataSource } from "@/backend/data-source"; //  TypeORM 的資料源
import bcrypt from "bcrypt";

declare module "next-auth" {
  //套件擴展
  interface Session {
    user: {
      id: string; // 添加自定義屬性
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      id: "login",
      //api導航(navigation)
      credentials: {
        //form不寫label 寫在這裡
        email: { label: "email", type: "email" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        // console.log("驗證開始");
        try {
          if (!credentials || !credentials.email || !credentials.password) {
            throw new Error("Email and password are required");
          }
          // console.log(credentials.email);
          // console.log("密碼驗證" + credentials.password);
          const { email, password } = credentials; //解構
          const getDataSourse = await initDataSource(); //資料庫初始化
          if (getDataSourse.isInitialized) {
            console.log("Database connection successful in NextAuth!");
          }
          const userRepository = await getDataSourse.getRepository(User); //取得實體(entity)
          // if (!userRepository) {
          //   console.log("取得實體失敗");
          // } else {
          //   console.log("已取得實體");
          // }
          const user = await userRepository.findOne({ where: { email } }); //尋找user
          // console.log("尋找user");
          // console.log(user);
          if (!user || !user.id || !user.email) {
            //驗證user
            throw new Error("無法找到eamill");
          }

          const isValidPassword = await bcrypt.compare(password, user.password); //驗證password
          if (!isValidPassword) {
            throw new Error("Invalid password");
          }
          console.log(user);
          return {
            id: user.id?.toString(), // 確保 id 是字符串
            email: user.email,
          };
        } catch (error) {
          if (error instanceof Error) {
            console.log("日誌拋出錯誤");

            // console.dir(error, { depth: null });
            throw new Error(error.message);
          } else {
            throw new Error("An unexpected error occurred");
          }
        }
      },
    }),
  ],
  pages: {
    signIn: "/signin", // 指定自定义的登录页面
    error: "/auth/error",
  },
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.expires = Date.now() + 7 * 24 * 60 * 60 * 1000;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = typeof token.id === "string" ? token.id : ""; //unknow 除非斷言 或類型檢查 才能清除error
      session.user.name = token.name;
      return session;
    },
    // async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
    //   if (url === "auth/signin") {
    //     return baseUrl;
    //   }
    //   return url.startsWith(baseUrl) ? url : baseUrl;
    // },
  },
  secret: process.env.NEXTAUTH_SECRET,
  logger: {
    error(code: string, ...message) {
      console.error("NextAuth Error:", code, message);
      // 可以在此处集成到外部的日志服务，例如 Sentry 或 Loggly
    },
    warn(code: string, ...message) {
      console.warn("NextAuth Warning:", code, message);
    },
    debug(code: string, ...message) {
      console.debug("NextAuth Debug:", code, message);
    },
  },
  debug: true,
};
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
