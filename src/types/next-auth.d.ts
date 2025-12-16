/* eslint-disable no-unused-vars */
import 'next-auth';
import type { DefaultSession } from 'next-auth';
import type { DefaultJWT } from 'next-auth/jwt';
declare module 'next-auth' {
  //套件擴展
  interface Session extends DefaultSession {
    user: {
      id: string; // 添加自定義屬性
      name?: string | null;
      email?: string | null;
      // image?: string | null;
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id: string;
    name?: string | null;
    email?: string | null;
    // image?: string | null;
  }
}
