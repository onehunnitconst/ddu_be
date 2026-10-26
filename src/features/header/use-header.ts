"use client";

import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { useSession } from "@/hooks/use-session";
import { logout } from "@/utils/auth-api";
import { buildMenus } from "./utils/build-menus";

export function useHeader() {
  const pathname = usePathname();
  const menus = useMemo(() => buildMenus(pathname), [pathname]);

  const { status, user, setUser } = useSession();
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const logoutUser = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await logout();
    } catch {
      // 서버 호출이 실패해도 화면의 로그인 상태는 해제한다 (토큰은 만료되면 무효)
    } finally {
      setUser(null);
      setIsLoggingOut(false);
    }
  };

  return {
    menus,
    sessionStatus: status,
    nickname: user?.nickname ?? null,
    isAdmin: user?.isAdmin ?? false,
    isLoggingOut,
    isAuthDialogOpen,
    setAuthDialogOpen: setIsAuthDialogOpen,
    openAuthDialog: () => setIsAuthDialogOpen(true),
    logout: logoutUser,
  };
}
