"use client";

import { HeaderView } from "../header-view";
import { buildMenus } from "../utils/build-menus";

const noop = () => {};

/** 경로를 아직 알 수 없을 때(Suspense fallback) 보여주는 헤더: 활성 메뉴 표시와 계정 영역 없이 렌더링한다 */
export function HeaderFallback() {
  return (
    <HeaderView
      menus={buildMenus(null)}
      sessionStatus="loading"
      nickname={null}
      isAdmin={false}
      isLoggingOut={false}
      onLoginClick={noop}
      onLogoutClick={noop}
    />
  );
}
