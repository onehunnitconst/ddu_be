import { Suspense, type ReactNode } from "react";
import { getPageUser } from "@/server/auth/page-session";
import { LoginGatePending } from "./components/login-gate-pending";
import { LoginGateContainer } from "./login-gate-container";

/**
 * 관리자에게만 children을 보여준다 (RequireLogin과 같이 서버에서 확인해, 아니면 내용이 내려가지 않는다).
 * 관리자 지정: pnpm users:admin <loginId>
 */
export function RequireAdmin({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<LoginGatePending />}>
      <AdminCheck>{children}</AdminCheck>
    </Suspense>
  );
}

async function AdminCheck({ children }: { children: ReactNode }) {
  const user = await getPageUser();
  if (!user) return <LoginGateContainer />;
  if (!user.isAdmin) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-1 p-8 text-center">
        <h1 className="text-xl font-semibold">관리자만 볼 수 있는 화면입니다</h1>
        <p className="text-sm text-muted-foreground">관리자 권한이 필요하면 운영자에게 문의해 주세요.</p>
      </div>
    );
  }
  return children;
}
