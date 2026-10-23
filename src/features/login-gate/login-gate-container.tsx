"use client";

import { AuthDialogContainer } from "@/features/auth-dialog/auth-dialog-container";
import { LoginGatePending } from "./components/login-gate-pending";
import { LoginGateView } from "./login-gate-view";
import { useLoginGate } from "./use-login-gate";

export function LoginGateContainer() {
  const { isPending, isAuthDialogOpen, setAuthDialogOpen, openAuthDialog } = useLoginGate();

  if (isPending) return <LoginGatePending />;

  return (
    <LoginGateView
      onLoginClick={openAuthDialog}
      authDialog={<AuthDialogContainer open={isAuthDialogOpen} onOpenChange={setAuthDialogOpen} />}
    />
  );
}
