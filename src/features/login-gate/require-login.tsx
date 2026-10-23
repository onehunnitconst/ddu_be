import { Suspense, type ReactNode } from "react";
import { getPageUserId } from "@/server/auth/page-session";
import { LoginGateContainer } from "./login-gate-container";
import { LoginGatePending } from "./components/login-gate-pending";

/**
 * 로그인한 사용자에게만 children을 보여준다. 토큰은 서버에서 확인하므로,
 * 비로그인 요청에는 children이 렌더링되지 않고 내용(HTML·RSC payload)도 내려가지 않는다.
 * children 안의 데이터 조회도 로그인 확인 뒤에만 실행되도록, 조회는 children 컴포넌트 안에서 한다.
 */
export function RequireLogin({ children }: { children: ReactNode }) {
  // 쿠키는 요청마다 달라 정적 셸에는 fallback만 들어간다
  return (
    <Suspense fallback={<LoginGatePending />}>
      <LoginCheck>{children}</LoginCheck>
    </Suspense>
  );
}

async function LoginCheck({ children }: { children: ReactNode }) {
  return (await getPageUserId()) ? children : <LoginGateContainer />;
}
