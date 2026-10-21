/** app/api 오류 응답 형식 (src/server/http/route-handler.ts) */
type ApiErrorBody = {
  error: { code: string; message: string; fields?: Record<string, string[]> };
};

export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
    readonly fields?: Record<string, string[]>,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  /** 401이면 토큰을 갱신하고 한 번 다시 요청한다 (기본 true) */
  retryOnUnauthorized?: boolean;
};

let refreshing: Promise<boolean> | null = null;

/** 동시에 여러 요청이 401을 받아도 갱신 요청은 한 번만 보낸다 */
function refreshSession() {
  refreshing ??= fetch("/api/auth/refresh", { method: "POST" })
    .then((response) => response.ok)
    .catch(() => false)
    .finally(() => {
      refreshing = null;
    });
  return refreshing;
}

async function toApiError(response: Response) {
  try {
    const { error } = (await response.json()) as ApiErrorBody;
    return new ApiError(response.status, error.code, error.message, error.fields);
  } catch {
    return new ApiError(response.status, "UNKNOWN_ERROR", "요청을 처리하지 못했습니다.");
  }
}

/** 같은 출처의 API를 JSON으로 호출한다. 실패 응답은 ApiError로 던진다 */
export async function apiRequest<T>(
  path: string,
  { method = "GET", body, retryOnUnauthorized = true }: RequestOptions = {},
): Promise<T> {
  const send = () =>
    fetch(path, {
      method,
      headers: body === undefined ? undefined : { "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
    });

  let response = await send();
  if (response.status === 401 && retryOnUnauthorized && (await refreshSession())) {
    response = await send();
  }
  if (!response.ok) throw await toApiError(response);

  return (response.status === 204 ? undefined : await response.json()) as T;
}
