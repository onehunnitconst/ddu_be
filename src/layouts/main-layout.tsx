import { Suspense, type ReactNode } from "react";
import { SessionProvider } from "@/components/session-provider";
import { HeaderFallback } from "@/features/header/components/header-fallback";
import { HeaderContainer } from "@/features/header/header-container";

export function MainLayout({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      {/* cacheComponents 환경에서 usePathname이 동적 라우트에서 suspend될 수 있어
          활성 표시가 없는 헤더를 fallback으로 둔다 */}
      <Suspense fallback={<HeaderFallback />}>
        <HeaderContainer />
      </Suspense>
      <main className="flex flex-1 flex-col">{children}</main>
    </SessionProvider>
  );
}
