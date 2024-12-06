import React from "react";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
const SessionState: React.FC<{ children: React.ReactNode }> = async ({
  children,
}) => {
  const session = await getServerSession(authOptions);

  return <SessionProvider session={session}>{children}</SessionProvider>;
};

export default SessionState;
