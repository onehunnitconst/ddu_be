import { isValidLoginId, isValidNickname, isValidPassword } from "@/utils/user-rules";
import { ERROR_MESSAGES } from "../constants";
import type { FieldErrors, LoginValues, SignupValues } from "./form-values";

export function validateLogin(values: LoginValues): FieldErrors {
  const errors: FieldErrors = {};
  if (!values.loginId) errors.loginId = ERROR_MESSAGES.required;
  if (!values.password) errors.password = ERROR_MESSAGES.required;
  return errors;
}

/** 서버(src/server/validators/auth.ts)와 같은 규칙 + 비밀번호 확인 */
export function validateSignup(values: SignupValues): FieldErrors {
  const errors: FieldErrors = {};
  if (!isValidLoginId(values.loginId)) errors.loginId = ERROR_MESSAGES.loginId;
  if (!isValidPassword(values.password)) errors.password = ERROR_MESSAGES.password;
  if (values.passwordConfirm !== values.password) {
    errors.passwordConfirm = ERROR_MESSAGES.passwordConfirm;
  }
  if (!isValidNickname(values.nickname)) errors.nickname = ERROR_MESSAGES.nickname;
  return errors;
}

export const hasErrors = (errors: FieldErrors) => Object.keys(errors).length > 0;
