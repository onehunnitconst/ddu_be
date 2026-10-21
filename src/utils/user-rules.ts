/**
 * 사용자 속성의 값 도메인.
 * 로그인 ID·닉네임 규칙은 DB CHECK 제약(prisma/migrations/*_create_users)과 같게 유지한다.
 * 패스워드는 DB에 해시만 저장하므로 평문 규칙은 여기서만 검사한다.
 */

/** 로그인 ID: 영문 소문자로 시작, 영문 소문자·숫자·_ 4–20자 */
export const LOGIN_ID_PATTERN = /^[a-z][a-z0-9_]{3,19}$/;

/** 패스워드(평문): 8–64자, 영문과 숫자를 각 1자 이상 포함, 공백 불가 */
export const PASSWORD_PATTERN = /^(?=.*[A-Za-z])(?=.*\d)\S{8,64}$/;

/** 닉네임: 한글(완성형)·영문·숫자 2–12자 */
export const NICKNAME_PATTERN = /^[가-힣a-zA-Z0-9]{2,12}$/;

export const isValidLoginId = (value: string) => LOGIN_ID_PATTERN.test(value);
export const isValidPassword = (value: string) => PASSWORD_PATTERN.test(value);
export const isValidNickname = (value: string) => NICKNAME_PATTERN.test(value);
