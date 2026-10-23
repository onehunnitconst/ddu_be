import Link from "next/link";
import type { ReactNode } from "react";
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
import { SITE_NAME } from "./constants";
import type { HeaderMenu } from "./utils/build-menus";

type HeaderViewProps = {
  menus: HeaderMenu[];
  sessionStatus: SessionStatus;
  nickname: string | null;
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
  isLoggingOut,
  onLoginClick,
  onLogoutClick,
  authDialog,
}: HeaderViewProps) {
  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <div className="flex h-14 items-center gap-6 px-4">
        <Link href="/" className="text-lg font-bold">
          {SITE_NAME}
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
          {sessionStatus === "authenticated" && nickname ? (
            <>
              <span className="text-sm">
                <span className="font-semibold">{nickname}</span> 님
              </span>
              <Button variant="ghost" onClick={onLogoutClick} disabled={isLoggingOut}>
                로그아웃
              </Button>
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
