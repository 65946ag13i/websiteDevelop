"use client";

import { SessionProvider as Provider } from "next-auth/react";
export function SessionProvider({
  session,
  children,
}: {
  session?: any;
  children: React.ReactNode;
}) {
  return <Provider session={session}>{children}</Provider>;
}
