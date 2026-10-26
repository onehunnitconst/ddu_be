"use client";

import { AuthDialogContainer } from "@/features/auth-dialog/auth-dialog-container";
import { HeaderView } from "./header-view";
import { useHeader } from "./use-header";

export function HeaderContainer() {
  const {
    menus,
    sessionStatus,
    nickname,
    isAdmin,
    isLoggingOut,
    isAuthDialogOpen,
    setAuthDialogOpen,
    openAuthDialog,
    logout,
  } = useHeader();

  return (
    <HeaderView
      menus={menus}
      sessionStatus={sessionStatus}
      nickname={nickname}
      isAdmin={isAdmin}
      isLoggingOut={isLoggingOut}
      onLoginClick={openAuthDialog}
      onLogoutClick={() => void logout()}
      authDialog={
        <AuthDialogContainer open={isAuthDialogOpen} onOpenChange={setAuthDialogOpen} />
      }
    />
  );
}
