import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { User } from "@/backend/entities/User"; // 引入 User 實體
import { initDataSourse } from "@/backend/data-source"; //  TypeORM 的資料源
import bcrypt from "bcrypt";
import { oauth2List } from "@/backend/entities/oauth2List";
import { validate } from "class-validator";
import { NextAuthOptions } from "next-auth";

declare module "next-auth" {
  //套件擴展
  interface Session {
    user: {
      id: string; // 添加自定義屬性
      name?: string | null;
      email?: string | null;
      // image?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    name?: string | null;
    email?: string | null;
    // image?: string | null;
  }
}

interface Credentials {
  email: string;
  password: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    CredentialsProvider({
      id: "login",
      //api導航(navigation)
      credentials: {
        //form不寫label 寫在這裡
        email: { label: "email", type: "email" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials: Credentials | undefined) {
        // console.log("驗證開始");
        try {
          if (!credentials || !credentials.email || !credentials.password) {
            throw new Error("Email and password are required");
          }
          // console.log(credentials.email);
          // console.log("密碼驗證" + credentials.password);
          const { email, password } = credentials; //解構
          const getDataSourse = await initDataSourse(); //資料庫初始化
          const userRepository = await getDataSourse.getRepository(User); //取得實體(entity)
          const user = await userRepository.findOne({
            where: { email: email },
            select: ["id", "email", "name", "password"],
          }); //尋找user

          if (!user || !user.id || !user.email) {
            throw new Error("無法找到eamill");
          }

          const isValidPassword = await bcrypt.compare(password, user.password); //驗證password
          if (isValidPassword) {
            return {
              id: user.id?.toString(), // 確保 id 是字符串
              email: user.email,
              name: user.name,
            };
          } else {
            throw new Error("密碼錯誤");
          }
        } catch (error) {
          if (error instanceof Error) {
            console.error("日誌拋出錯誤");

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
    async signIn({ user, account, profile }) {
      if (account && account.provider && user && user.email && user.name) {
        if (account?.provider === "login") {
          return true;
        }
        try {
          if (account?.provider === "google" && user?.email) {
            const DataSourse = await initDataSourse();
            const userRepository = await DataSourse.getRepository(User);
            //查找重複email
            const existingUser = await userRepository.findOne({
              select: ["email"],
              where: { email: user.email },
            });

            if (!existingUser) {
              //
              const success = await DataSourse.manager.transaction(
                async (EntityManager) => {
                  if (
                    account &&
                    account.provider &&
                    user &&
                    user.email &&
                    user.name
                  ) {
                    const userSave = new User();
                    userSave.email = user.email;
                    userSave.name = user.name;

                    const useroauth = new oauth2List();
                    useroauth.provider = account.provider;
                    useroauth.profileId = user.id;
                    useroauth.name = user.name;

                    userSave.oauth2List = [useroauth];

                    const userErrors = await validate(userSave);
                    //驗證錯誤
                    if (userErrors.length > 0) {
                      const filiterUserErrors = userErrors.filter((error) =>
                        ["email", "name"].includes(error.property)
                      );
                      if (filiterUserErrors.length > 0) {
                        return "/signin";
                      }
                    }
                    const oauth2errors = await validate(useroauth);
                    if (oauth2errors.length > 0) {
                      return "/signin";
                    }
                    //驗證錯誤

                    await EntityManager.save(userSave);
                  }
                }
              );
              if (success) {
                return true;
              } else {
                return "/signin";
              }
            }
          }
        } catch (e) {
          console.error(e);
          return "/signin";
        }

        return "/signin";
      }

      return "/signin";
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.expires = Date.now() + 30 * 24 * 60 * 60 * 1000;
      }
      return token;
    },
    async session({ session, token }) {
      // session.user.id = typeof token.id === "string" ? token.id : ""; //unknow 除非斷言 或類型檢查 才能清除error
      // session.user.name = token.name;
      // session.user.email = token.email;
      session.user = token;
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
