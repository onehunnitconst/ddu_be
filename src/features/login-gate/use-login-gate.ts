"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/hooks/use-session";

/**
 * 서버가 로그인 화면을 보여줬는데 클라이언트의 세션 복원(만료된 토큰 갱신)이 성공하면,
 * 페이지를 서버에서 다시 그려 본문을 받는다. 로그인·로그아웃 때의 다시 그리기는 SessionProvider가 맡는다
 */
export function useLoginGate() {
  const router = useRouter();
  const { status } = useSession();
  const [isAuthDialogOpen, setAuthDialogOpen] = useState(false);
  const previousStatus = useRef(status);

  useEffect(() => {
    const restored = previousStatus.current === "loading" && status === "authenticated";
    previousStatus.current = status;
    if (restored) router.refresh();
  }, [status, router]);

  return {
    /** 세션을 확인 중이거나, 로그인돼 본문을 다시 받는 중 */
    isPending: status !== "unauthenticated",
    isAuthDialogOpen,
    setAuthDialogOpen,
    openAuthDialog: () => setAuthDialogOpen(true),
  };
}
