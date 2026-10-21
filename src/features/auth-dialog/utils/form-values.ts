export type LoginValues = {
  loginId: string;
  password: string;
};

export type SignupValues = {
  loginId: string;
  password: string;
  passwordConfirm: string;
  nickname: string;
};

export type FormField = keyof LoginValues | keyof SignupValues;

/** 입력란별 오류 메시지 (없으면 키가 없다) */
export type FieldErrors = Partial<Record<FormField, string>>;

export const EMPTY_LOGIN_VALUES: LoginValues = { loginId: "", password: "" };

export const EMPTY_SIGNUP_VALUES: SignupValues = {
  loginId: "",
  password: "",
  passwordConfirm: "",
  nickname: "",
};
