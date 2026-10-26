import { NextResponse } from "next/server";
import { badRequest } from "@/server/errors";
import { getAccessToken } from "@/server/http/auth-cookies";
import { handleRoute } from "@/server/http/route-handler";
import { uploadAdminImage } from "@/server/services/admin-service";
import { requireAdmin } from "@/server/services/auth-service";

/** POST /api/admin/images — multipart `file` (PNG·JPEG·WebP·GIF, 5MB 이하) → 201 { url } (관리자 전용) */
export const POST = handleRoute(async (request) => {
  await requireAdmin(getAccessToken(request));
  const form = await request.formData().catch(() => {
    throw badRequest("이미지 파일을 multipart/form-data로 보내 주세요.");
  });
  const url = await uploadAdminImage(form.get("file"));

  return NextResponse.json<{ url: string }>({ url }, { status: 201 });
});
