"use client";

import { use } from "react";
import { SessionContext } from "@/components/session-provider";

export function useSession() {
  const session = use(SessionContext);
  if (!session) throw new Error("useSession must be used within <SessionProvider>");
  return session;
}
