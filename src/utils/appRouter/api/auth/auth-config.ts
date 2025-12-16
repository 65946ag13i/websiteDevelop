import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { User } from '@/backend/entities/User'; // 引入 User 實體
import { initDataSourse } from '@/backend/data-source'; //  TypeORM 的資料源
import bcrypt from 'bcrypt';
import { oauth2List } from '@/backend/entities/oauth2List';
import { validate } from 'class-validator';
import { NextAuthOptions } from 'next-auth';

interface Credentials {
  email: string;
  password: string;
}

export const authOptions: NextAuthOptions = {
  //google登入
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),

    //內建登入 純英文 自定義登入可使用
    CredentialsProvider({
      id: 'login',
      //api導航(navigation)
      credentials: {
        //form不寫label 寫在這裡
        email: { label: 'email', type: 'email' },
        password: { label: 'password', type: 'password' },
      },
      async authorize(credentials: Credentials | undefined) {
        // console.log("驗證開始");
        try {
          if (!credentials || !credentials.email || !credentials.password) {
            throw new Error('Email and password are required');
          }
          // console.log(credentials.email);
          // console.log("密碼驗證" + credentials.password);
          const { email, password } = credentials; //解構
          const getDataSourse = await initDataSourse(); //資料庫初始化
          const userRepository = await getDataSourse.getRepository(User); //取得實體(entity)
          //資料庫找使用者
          const user = await userRepository.findOne({
            where: { email: email },
            select: ['id', 'email', 'name', 'password'],
          });

          if (!user || !user.id || !user.email) {
            console.error('無法找到eamill');
            throw new Error('無法找到eamill');
          }
          //密碼加鹽比對
          const isValidPassword = await bcrypt.compare(password, user.password); //驗證password
          if (isValidPassword) {
            return {
              //返回使用者資料
              id: user.id?.toString(), // 確保 id 是字符串
              email: user.email,
              name: user.name,
            };
          } else {
            console.error('密碼錯誤');
            throw new Error('密碼錯誤');
          }
        } catch (error) {
          if (error instanceof Error) {
            console.error('日誌拋出錯誤');

            // console.dir(error, { depth: null });
            throw new Error(error.message);
          } else {
            throw new Error('An unexpected error occurred');
          }
        }
      },
    }),
  ],
  pages: {
    signIn: '/signin', // 指定自定义的登录页面
    error: '/signin',
  },
  session: { strategy: 'jwt', maxAge: 30 * 24 * 60 * 60 },
  callbacks: {
    async signIn({ user, account }) {
      if (account && account.provider && user && user.email && user.name) {
        //檢測登入方式 login直接true
        if (account?.provider === 'login') {
          return true;
        }
        try {
          if (account?.provider === 'google' && user?.email) {
            const DataSourse = await initDataSourse();
            const userRepository = await DataSourse.getRepository(User);
            //查找email是否已經建立資料
            const existingUser = await userRepository.findOne({
              where: { email: user.email },
            });
            //不存在就建立使用者資料
            console.log('使用者存在?:');
            console.dir(existingUser, { depth: null });
            if (!existingUser) {
              //建立事務失敗就回滾
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
                        ['email', 'name'].includes(error.property)
                      );
                      if (filiterUserErrors.length > 0) {
                        console.log('filiterUserErrors?:');
                        console.dir(filiterUserErrors, { depth: null });
                        return false;
                      }
                    }
                    const oauth2errors = await validate(useroauth);
                    if (oauth2errors.length > 0) {
                      console.log('oauth2errors?:');
                      console.dir(oauth2errors, { depth: null });
                      return false;
                    }
                    //事務儲存
                    await EntityManager.save(userSave);
                    return true;
                  }
                }
              );
              if (success) {
                return true;
              } else {
                return false;
              }
            }
            console.log('返回true');
            return true;
          }
        } catch (e) {
          console.error('Error in signIn callback:', e);
          return false; // 錯誤時拒絕登入
        }

        return false;
      }

      return false;
    },
    //設定jwt token
    async jwt({ token, user }) {
      // 1. 第一次登入：user 有資料，token 還沒建立
      if (user && user.email) {
        const dataSource = await initDataSourse();
        const userRepository = dataSource.getRepository(User);

        // 用 email 查資料庫，取得 User.id
        const dbUser = await userRepository.findOne({
          where: { email: user.email },
          select: ['id', 'name', 'email'],
        });

        if (dbUser) {
          token.id = dbUser.id.toString();
          token.name = dbUser.name;
          token.email = dbUser.email;
        }
      }
      return token;
    },
    //返回session
    async session({ session, token }) {
      // session.user.id = typeof token.id === "string" ? token.id : ""; //unknow 除非斷言 或類型檢查 才能清除error
      // session.user.name = token.name;
      // session.user.email = token.email;
      session.user = token;
      return session;
    },
    async redirect({ url, baseUrl }) {
      // 如果是从登录页面重定向，则转到首页
      console.log(`Redirecting from ${url} with base ${baseUrl}`);
      if (url === `${baseUrl}/signin`) {
        console.log(`Redirecting from ${url} with base ${baseUrl}`);
        return `${baseUrl}/`;
      }
      return url;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  logger: {
    error(code: string, ...message) {
      console.error('NextAuth Error:', code, message);
      // 可以在此处集成到外部的日志服务，例如 Sentry 或 Loggly
    },
    warn(code: string, ...message) {
      console.warn('NextAuth Warning:', code, message);
    },
    debug(code: string, ...message) {
      console.debug('NextAuth Debug:', code, message);
    },
  },
  debug: true,
};
