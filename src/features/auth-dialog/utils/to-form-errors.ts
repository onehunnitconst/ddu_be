import { ApiError } from "@/utils/api-client";
import { ERROR_MESSAGES } from "../constants";
import type { FieldErrors, FormField } from "./form-values";

/** 입력란 하나에 해당하는 서버 오류 코드 */
const FIELD_BY_CODE: Record<string, FormField> = {
  LOGIN_ID_TAKEN: "loginId",
  NICKNAME_TAKEN: "nickname",
};

/** API 오류를 입력란 오류와 폼 전체 오류로 나눈다 */
export function toFormErrors(error: unknown): {
  fieldErrors: FieldErrors;
  formError: string | null;
} {
  if (!(error instanceof ApiError)) {
    return { fieldErrors: {}, formError: ERROR_MESSAGES.network };
  }

  const field = FIELD_BY_CODE[error.code];
  if (field) return { fieldErrors: { [field]: error.message }, formError: null };

  if (error.fields) {
    const fieldErrors: FieldErrors = {};
    for (const [name, messages] of Object.entries(error.fields)) {
      if (messages[0]) fieldErrors[name as FormField] = messages[0];
    }
    return { fieldErrors, formError: null };
  }

  return { fieldErrors: {}, formError: error.message };
}
