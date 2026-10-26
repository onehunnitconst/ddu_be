/** API가 돌려주는 로그인 사용자 정보 */
export type AuthUser = {
  id: string;
  loginId: string;
  nickname: string;
  /** 관리자 (/admin 화면과 관리 API 사용 가능) */
  isAdmin: boolean;
};

export type SessionStatus = "loading" | "authenticated" | "unauthenticated";

export type LoginInput = {
  loginId: string;
  password: string;
};

export type SignupInput = {
  loginId: string;
  password: string;
  nickname: string;
};
