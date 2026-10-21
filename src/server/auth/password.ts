import "server-only";

import { hash, verify, type Options } from "@node-rs/argon2";

/** OWASP 권장값: argon2id, 19 MiB, 2회 반복, 병렬 1 */
const ARGON2_OPTIONS: Options = {
  algorithm: 2, // Algorithm.Argon2id (const enum이라 isolatedModules에서 직접 import할 수 없다)
  memoryCost: 19456,
  timeCost: 2,
  parallelism: 1,
};

export function hashPassword(password: string) {
  return hash(password, ARGON2_OPTIONS);
}

export async function verifyPassword(passwordHash: string, password: string) {
  try {
    return await verify(passwordHash, password);
  } catch {
    return false;
  }
}

let dummyHash: Promise<string> | undefined;

/**
 * 존재하지 않는 로그인 ID에도 해시 검증을 한 번 수행해,
 * 응답 시간으로 계정 존재 여부를 추측할 수 없게 한다.
 */
export async function verifyDummyPassword(password: string) {
  dummyHash ??= hashPassword("dummy-password-for-timing-0");
  await verifyPassword(await dummyHash, password);
  return false;
}
