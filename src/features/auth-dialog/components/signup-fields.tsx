import { FieldGroup } from "@/components/ui/field";
import { SIGNUP_HINTS } from "../constants";
import type { FieldErrors, SignupValues } from "../utils/form-values";
import { TextField } from "./text-field";

type SignupFieldsProps = {
  values: SignupValues;
  errors: FieldErrors;
  disabled: boolean;
  onChange: (field: keyof SignupValues, value: string) => void;
};

export function SignupFields({ values, errors, disabled, onChange }: SignupFieldsProps) {
  return (
    <FieldGroup>
      <TextField
        id="signup-id"
        label="아이디"
        value={values.loginId}
        onChange={(value) => onChange("loginId", value)}
        autoComplete="username"
        hint={SIGNUP_HINTS.loginId}
        error={errors.loginId}
        disabled={disabled}
        autoFocus
      />
      <TextField
        id="signup-password"
        label="비밀번호"
        type="password"
        value={values.password}
        onChange={(value) => onChange("password", value)}
        autoComplete="new-password"
        hint={SIGNUP_HINTS.password}
        error={errors.password}
        disabled={disabled}
      />
      <TextField
        id="signup-password-confirm"
        label="비밀번호 확인"
        type="password"
        value={values.passwordConfirm}
        onChange={(value) => onChange("passwordConfirm", value)}
        autoComplete="new-password"
        error={errors.passwordConfirm}
        disabled={disabled}
      />
      <TextField
        id="signup-nickname"
        label="닉네임"
        value={values.nickname}
        onChange={(value) => onChange("nickname", value)}
        autoComplete="nickname"
        hint={SIGNUP_HINTS.nickname}
        error={errors.nickname}
        disabled={disabled}
      />
    </FieldGroup>
  );
}
