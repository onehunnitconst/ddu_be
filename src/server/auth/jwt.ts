import "server-only";

import { importJWK, jwtVerify, SignJWT, type JWK } from "jose";
import { ACCESS_TOKEN_TTL_SECONDS, JWT_AUDIENCE, JWT_ISSUER } from "./config";

const ALG = "ES256";

type SigningKeys = Awaited<ReturnType<typeof importKeys>>;

let keys: Promise<SigningKeys> | undefined;

/** JWT_PRIVATE_JWK(EC P-256 private JWK)에서 서명키와, d를 뺀 검증키를 만든다 */
async function importKeys() {
  const raw = process.env.JWT_PRIVATE_JWK;
  if (!raw) throw new Error("JWT_PRIVATE_JWK is not set");

  const privateJwk = JSON.parse(raw) as JWK;
  const publicJwk: JWK = { ...privateJwk };
  delete publicJwk.d;

  const [privateKey, publicKey] = await Promise.all([
    importJWK(privateJwk, ALG),
    importJWK(publicJwk, ALG),
  ]);
  return { privateKey, publicKey };
}

const getKeys = () => (keys ??= importKeys());

export async function signAccessToken(userId: string) {
  const { privateKey } = await getKeys();
  const expiresAt = new Date(Date.now() + ACCESS_TOKEN_TTL_SECONDS * 1000);

  const token = await new SignJWT()
    .setProtectedHeader({ alg: ALG, typ: "JWT" })
    .setSubject(userId)
    .setIssuer(JWT_ISSUER)
    .setAudience(JWT_AUDIENCE)
    .setIssuedAt()
    .setExpirationTime(expiresAt)
    .sign(privateKey);

  return { token, expiresAt };
}

/** 서명·만료·발급자·대상을 검증하고 사용자 ID를 돌려준다. 유효하지 않으면 null */
export async function verifyAccessToken(token: string) {
  const { publicKey } = await getKeys();
  try {
    const { payload } = await jwtVerify(token, publicKey, {
      algorithms: [ALG],
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    });
    return payload.sub ?? null;
  } catch {
    return null;
  }
}
