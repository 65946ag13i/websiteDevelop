import React from "react";

import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/appRouter/api/auth/auth-config";
import { SessionProvider } from "next-auth/react";
const SessionState: React.FC<{ children: React.ReactNode }> = async ({
  children,
}) => {
  const session = await getServerSession(authOptions);

  return <SessionProvider session={session}>{children}</SessionProvider>;
};

export default SessionState;
