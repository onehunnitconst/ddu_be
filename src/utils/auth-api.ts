import type { AuthUser, LoginInput, SignupInput } from "@/types/auth";
import { ApiError, apiRequest } from "./api-client";

type UserResponse = { user: AuthUser };

export async function login(input: LoginInput) {
  const { user } = await apiRequest<UserResponse>("/api/auth/login", {
    method: "POST",
    body: input,
    retryOnUnauthorized: false,
  });
  return user;
}

export async function signup(input: SignupInput) {
  const { user } = await apiRequest<UserResponse>("/api/auth/signup", {
    method: "POST",
    body: input,
    retryOnUnauthorized: false,
  });
  return user;
}

export function logout() {
  return apiRequest<void>("/api/auth/logout", {
    method: "POST",
    retryOnUnauthorized: false,
  });
}

/** 로그인 상태면 사용자, 아니면 null (액세스 토큰이 만료됐으면 갱신 후 다시 조회) */
export async function fetchCurrentUser() {
  try {
    const { user } = await apiRequest<UserResponse>("/api/auth/me");
    return user;
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) return null;
    throw error;
  }
}
