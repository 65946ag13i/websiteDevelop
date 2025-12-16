"use client";

import { SessionProvider as Provider } from "next-auth/react";
import React from "react";
export function SessionProvider({
  session,
  children,
}: {
  session?: any;
  children: React.ReactNode;
}) {
  return <Provider session={session}>{children}</Provider>;
}
