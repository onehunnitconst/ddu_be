import Link from "next/link";
import type { ReactNode } from "react";
import { LogoMark } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import type { SessionStatus } from "@/types/auth";
import { cn } from "@/utils/cn";
import { UserMenu } from "./components/user-menu";
import { SITE_NAME } from "./constants";
import type { HeaderMenu } from "./utils/build-menus";

type HeaderViewProps = {
  menus: HeaderMenu[];
  sessionStatus: SessionStatus;
  nickname: string | null;
  /** 관리자에게만 관리 화면 링크를 보여준다 */
  isAdmin: boolean;
  isLoggingOut: boolean;
  onLoginClick: () => void;
  onLogoutClick: () => void;
  /** 로그인/회원가입 다이얼로그 (Container가 주입) */
  authDialog?: ReactNode;
};

export function HeaderView({
  menus,
  sessionStatus,
  nickname,
  isAdmin,
  isLoggingOut,
  onLoginClick,
  onLogoutClick,
  authDialog,
}: HeaderViewProps) {
  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <div className="flex h-14 items-center gap-6 px-4">
        {/* 모바일에서는 로고 마크만, sm(640px) 이상에서는 사이트 이름도 보여준다 */}
        <Link href="/" aria-label={SITE_NAME} className="flex shrink-0 items-center gap-2 text-lg font-bold">
          <LogoMark />
          <span className="hidden sm:inline">{SITE_NAME}</span>
        </Link>

        <NavigationMenu>
          <NavigationMenuList>
            {menus.map((menu) => (
              <NavigationMenuItem key={menu.label}>
                <NavigationMenuTrigger
                  className={cn(menu.isActive && "text-primary")}
                >
                  {menu.label}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="flex w-72 flex-col">
                    {menu.items.map((item) => (
                      <li key={item.href}>
                        <NavigationMenuLink
                          active={item.isActive}
                          render={<Link href={item.href} />}
                        >
                          {item.label}
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          {sessionStatus === "authenticated" && nickname ? (
            <>
              {/* sm(640px) 이상: 관리·닉네임·로그아웃을 그대로 늘어놓는다 */}
              <div className="hidden items-center gap-2 sm:flex">
                {isAdmin && (
                  <Button variant="ghost" render={<Link href="/admin" />} nativeButton={false}>
                    관리
                  </Button>
                )}
                <span className="text-sm whitespace-nowrap">
                  <span className="font-semibold">{nickname}</span> 님
                </span>
                <Button variant="ghost" onClick={onLogoutClick} disabled={isLoggingOut}>
                  로그아웃
                </Button>
              </div>
              {/* 모바일: 공간이 좁아 사용자 메뉴 하나로 묶는다 */}
              <div className="sm:hidden">
                <UserMenu
                  nickname={nickname}
                  isAdmin={isAdmin}
                  isLoggingOut={isLoggingOut}
                  onLogoutClick={onLogoutClick}
                />
              </div>
            </>
          ) : sessionStatus === "unauthenticated" ? (
            <Button variant="ghost" onClick={onLoginClick}>
              로그인
            </Button>
          ) : (
            // 로그인 상태 확인 중: 버튼 자리를 비워 두어 레이아웃이 흔들리지 않게 한다
            <div className="h-9 w-16" aria-hidden />
          )}
        </div>
      </div>
      {authDialog}
    </header>
  );
}
