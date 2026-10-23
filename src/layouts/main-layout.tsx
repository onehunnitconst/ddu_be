import { Suspense, type ReactNode } from "react";
import { SessionProvider } from "@/components/session-provider";
import { HeaderFallback } from "@/features/header/components/header-fallback";
import { HeaderContainer } from "@/features/header/header-container";

export function MainLayout({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      {/* 앱 전체를 max-w-6xl 흰 영역 하나로 제한하고, 넓은 화면의 양쪽 여백은 회색(body)으로 둔다 */}
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col bg-background">
        {/* cacheComponents 환경에서 usePathname이 동적 라우트에서 suspend될 수 있어
            활성 표시가 없는 헤더를 fallback으로 둔다 */}
        <Suspense fallback={<HeaderFallback />}>
          <HeaderContainer />
        </Suspense>
        <main className="flex flex-1 flex-col">{children}</main>
      </div>
    </SessionProvider>
  );
}
