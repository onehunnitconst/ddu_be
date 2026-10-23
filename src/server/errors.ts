/**
 * 서비스 계층에서 던지는 예상된 오류. HTTP 계층(src/server/http)이 status와 code로 응답을 만든다.
 */
export class AppError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
    readonly fields?: Record<string, string[]>,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export const badRequest = (message: string, fields?: Record<string, string[]>) =>
  new AppError(400, "VALIDATION_ERROR", message, fields);

export const unauthorized = (code: string, message: string) =>
  new AppError(401, code, message);

export const forbidden = (code: string, message: string) =>
  new AppError(403, code, message);

export const notFound = (code: string, message: string) =>
  new AppError(404, code, message);

export const conflict =(code: string, message: string) =>
  new AppError(409, code, message);
