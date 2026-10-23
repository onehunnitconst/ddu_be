import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

type LoginGateViewProps = {
  onLoginClick: () => void;
  /** 로그인 다이얼로그 (Container가 주입) */
  authDialog: ReactNode;
};

export function LoginGateView({ onLoginClick, authDialog }: LoginGateViewProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold">로그인이 필요합니다</h1>
        <p className="text-sm text-muted-foreground">로그인하면 이 화면을 볼 수 있습니다.</p>
      </div>
      <Button onClick={onLoginClick}>로그인</Button>
      {authDialog}
    </div>
  );
}
