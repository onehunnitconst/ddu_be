"use client";

import { AuthDialogView } from "./auth-dialog-view";
import { useAuthDialog } from "./use-auth-dialog";

type AuthDialogContainerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function AuthDialogContainer({ open, onOpenChange }: AuthDialogContainerProps) {
  const viewModel = useAuthDialog({ open, onOpenChange });

  return <AuthDialogView {...viewModel} />;
}
