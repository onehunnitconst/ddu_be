/** 로그인 여부를 확인하는 동안 본문 자리를 비워 둔다 */
export function LoginGatePending() {
  return <div className="flex-1" aria-busy />;
}
