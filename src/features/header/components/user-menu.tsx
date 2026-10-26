import { CircleUserRoundIcon, LogOutIcon, SettingsIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type UserMenuProps = {
  nickname: string;
  isAdmin: boolean;
  isLoggingOut: boolean;
  onLogoutClick: () => void;
};

/** 모바일 헤더의 사용자 메뉴: 아이콘 버튼 하나에 닉네임·관리·로그아웃을 묶는다 */
export function UserMenu({ nickname, isAdmin, isLoggingOut, onLogoutClick }: UserMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" size="icon" aria-label={`${nickname} 님 메뉴`} />}>
        <CircleUserRoundIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-44">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="truncate">
            <span className="font-semibold text-foreground">{nickname}</span> 님
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        {isAdmin && (
          <DropdownMenuItem render={<Link href="/admin" />}>
            <SettingsIcon />
            관리
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={onLogoutClick} disabled={isLoggingOut}>
          <LogOutIcon />
          로그아웃
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
