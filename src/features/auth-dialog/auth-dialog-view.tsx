import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LoginFields } from "./components/login-fields";
import { SignupFields } from "./components/signup-fields";
import { AUTH_DIALOG_TEXT, SUBMITTING_LABEL } from "./constants";
import type { AuthDialogViewModel } from "./use-auth-dialog";

type AuthDialogViewProps = AuthDialogViewModel;

export function AuthDialogView({
  open,
  mode,
  loginValues,
  signupValues,
  fieldErrors,
  formError,
  notice,
  isSubmitting,
  onOpenChange,
  onClosed,
  switchMode,
  changeLoginField,
  changeSignupField,
  submit,
}: AuthDialogViewProps) {
  const text = AUTH_DIALOG_TEXT[mode];

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => onOpenChange(nextOpen)}
      onOpenChangeComplete={(nextOpen) => {
        if (!nextOpen) onClosed();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{text.title}</DialogTitle>
          <DialogDescription>{text.description}</DialogDescription>
        </DialogHeader>

        <form
          noValidate
          className="flex flex-col gap-5"
          onSubmit={(event) => {
            event.preventDefault();
            void submit();
          }}
        >
          {mode === "login" ? (
            <LoginFields
              values={loginValues}
              errors={fieldErrors}
              disabled={isSubmitting}
              onChange={changeLoginField}
            />
          ) : (
            <SignupFields
              values={signupValues}
              errors={fieldErrors}
              disabled={isSubmitting}
              onChange={changeSignupField}
            />
          )}

          {notice && (
            <p role="status" className="text-sm text-emerald-700 dark:text-emerald-400">
              {notice}
            </p>
          )}

          {formError && (
            <p role="alert" className="text-sm text-destructive">
              {formError}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? SUBMITTING_LABEL : text.submit}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          {text.switchPrompt}{" "}
          <button
            type="button"
            className="font-medium text-foreground underline-offset-4 hover:underline"
            onClick={() => switchMode(mode === "login" ? "signup" : "login")}
            disabled={isSubmitting}
          >
            {text.switchAction}
          </button>
        </p>
      </DialogContent>
    </Dialog>
  );
}
