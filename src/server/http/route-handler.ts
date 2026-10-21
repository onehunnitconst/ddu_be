import "server-only";

import { unstable_rethrow } from "next/navigation";
import { NextResponse, type NextRequest } from "next/server";
import { AppError, badRequest } from "@/server/errors";

export type ErrorBody = {
  error: { code: string; message: string; fields?: Record<string, string[]> };
};

/** 서비스 오류를 HTTP 응답으로 바꾼다. 예상하지 못한 오류는 내용을 숨기고 500으로 응답한다 */
export function toErrorResponse(error: unknown) {
  if (error instanceof AppError) {
    return NextResponse.json<ErrorBody>(
      { error: { code: error.code, message: error.message, fields: error.fields } },
      { status: error.status },
    );
  }
  console.error(error);
  return NextResponse.json<ErrorBody>(
    { error: { code: "INTERNAL_ERROR", message: "요청을 처리하지 못했습니다." } },
    { status: 500 },
  );
}

/** 핸들러에서 던진 오류를 공통 형식의 오류 응답으로 바꿔준다 */
export function handleRoute<Context = unknown>(
  handler: (request: NextRequest, context: Context) => Promise<Response>,
) {
  return async (request: NextRequest, context: Context) => {
    try {
      return await handler(request, context);
    } catch (error) {
      // prerender 중단 신호 등 Next.js 내부 오류는 Next.js가 처리하도록 다시 던진다
      unstable_rethrow(error);
      return toErrorResponse(error);
    }
  };
}

export async function readJson(request: NextRequest): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    throw badRequest("요청 본문이 올바른 JSON이 아닙니다.");
  }
}
