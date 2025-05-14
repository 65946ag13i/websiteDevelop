// pages/api/auth/[...nextauth]/route.ts
// @ts-ignore
import NextAuth from "next-auth";
import { authOptions } from "@/utils/appRouter/api/auth/auth-config";

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
