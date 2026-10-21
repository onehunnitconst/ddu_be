import { FieldGroup } from "@/components/ui/field";
import type { FieldErrors, LoginValues } from "../utils/form-values";
import { TextField } from "./text-field";

type LoginFieldsProps = {
  values: LoginValues;
  errors: FieldErrors;
  disabled: boolean;
  onChange: (field: keyof LoginValues, value: string) => void;
};

export function LoginFields({ values, errors, disabled, onChange }: LoginFieldsProps) {
  return (
    <FieldGroup>
      <TextField
        id="login-id"
        label="아이디"
        value={values.loginId}
        onChange={(value) => onChange("loginId", value)}
        autoComplete="username"
        error={errors.loginId}
        disabled={disabled}
        autoFocus
      />
      <TextField
        id="login-password"
        label="비밀번호"
        type="password"
        value={values.password}
        onChange={(value) => onChange("password", value)}
        autoComplete="current-password"
        error={errors.password}
        disabled={disabled}
      />
    </FieldGroup>
  );
}
