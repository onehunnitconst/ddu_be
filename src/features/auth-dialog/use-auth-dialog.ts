"use client";

import { useState } from "react";
import { useSession } from "@/hooks/use-session";
import { login, signup } from "@/utils/auth-api";
import type { AuthMode } from "./constants";
import {
  EMPTY_LOGIN_VALUES,
  EMPTY_SIGNUP_VALUES,
  type FieldErrors,
  type LoginValues,
  type SignupValues,
} from "./utils/form-values";
import { toFormErrors } from "./utils/to-form-errors";
import { hasErrors, validateLogin, validateSignup } from "./utils/validate";

type UseAuthDialogOptions = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function useAuthDialog({ open, onOpenChange }: UseAuthDialogOptions) {
  const { setUser } = useSession();

  const [mode, setMode] = useState<AuthMode>("login");
  const [loginValues, setLoginValues] = useState(EMPTY_LOGIN_VALUES);
  const [signupValues, setSignupValues] = useState(EMPTY_SIGNUP_VALUES);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const clearErrors = () => {
    setFieldErrors({});
    setFormError(null);
  };

  /** 닫힘 애니메이션이 끝난 뒤 초기화해, 닫히는 동안 내용이 바뀌어 보이지 않게 한다 */
  const reset = () => {
    setMode("login");
    setLoginValues(EMPTY_LOGIN_VALUES);
    setSignupValues(EMPTY_SIGNUP_VALUES);
    clearErrors();
  };

  const switchMode = (next: AuthMode) => {
    setMode(next);
    clearErrors();
  };

  const clearFieldError = (field: keyof FieldErrors) =>
    setFieldErrors((errors) => {
      if (!(field in errors)) return errors;
      const next = { ...errors };
      delete next[field];
      return next;
    });

  const changeLoginField = (field: keyof LoginValues, value: string) => {
    setLoginValues((values) => ({ ...values, [field]: value }));
    clearFieldError(field);
  };

  const changeSignupField = (field: keyof SignupValues, value: string) => {
    setSignupValues((values) => ({ ...values, [field]: value }));
    clearFieldError(field);
  };

  const submit = async () => {
    if (isSubmitting) return;

    const errors = mode === "login" ? validateLogin(loginValues) : validateSignup(signupValues);
    if (hasErrors(errors)) {
      setFieldErrors(errors);
      setFormError(null);
      return;
    }

    setIsSubmitting(true);
    clearErrors();
    try {
      const user =
        mode === "login"
          ? await login(loginValues)
          : await signup({
              loginId: signupValues.loginId,
              password: signupValues.password,
              nickname: signupValues.nickname,
            });
      setUser(user);
      onOpenChange(false);
    } catch (error) {
      const next = toFormErrors(error);
      setFieldErrors(next.fieldErrors);
      setFormError(next.formError);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    open,
    mode,
    loginValues,
    signupValues,
    fieldErrors,
    formError,
    isSubmitting,
    onOpenChange,
    onClosed: reset,
    switchMode,
    changeLoginField,
    changeSignupField,
    submit,
  };
}

export type AuthDialogViewModel = ReturnType<typeof useAuthDialog>;
