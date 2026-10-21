"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { AuthUser, SessionStatus } from "@/types/auth";
import { fetchCurrentUser } from "@/utils/auth-api";

export type SessionContextValue = {
  status: SessionStatus;
  user: AuthUser | null;
  /** 로그인·회원가입 성공 시 사용자, 로그아웃 시 null */
  setUser: (user: AuthUser | null) => void;
};

export const SessionContext = createContext<SessionContextValue | null>(null);

type SessionState = Pick<SessionContextValue, "status" | "user">;

const toState = (user: AuthUser | null): SessionState => ({
  status: user ? "authenticated" : "unauthenticated",
  user,
});

/** 앱 진입 시 쿠키의 토큰으로 로그인 상태를 복원하고, 전역에서 공유한다 */
export function SessionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SessionState>({ status: "loading", user: null });

  useEffect(() => {
    let cancelled = false;
    fetchCurrentUser()
      .catch(() => null)
      .then((user) => {
        if (!cancelled) setState(toState(user));
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const setUser = useCallback((user: AuthUser | null) => setState(toState(user)), []);
  const value = useMemo(() => ({ ...state, setUser }), [state, setUser]);

  return <SessionContext value={value}>{children}</SessionContext>;
}
