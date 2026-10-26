import "server-only";

import { randomUUID } from "node:crypto";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/** 문제 음원을 담는 Supabase Storage private 버킷 */
const AUDIO_BUCKET = "audio";

/** 음원 signed URL 유효 시간: 1시간 (한 문제를 푸는 동안 충분하고, 새 문제마다 다시 발급한다) */
const AUDIO_URL_TTL_SECONDS = 60 * 60;

/**
 * 관리 화면에서 올린 이미지(문제·개념 카드)를 담는 public 버킷.
 * 개념 본문은 캐시된 마크다운이라 URL을 요청마다 서명할 수 없어 public으로 두고,
 * 파일명을 무작위 UUID로 지어 URL을 모르면 찾을 수 없게 한다 (public 버킷도 목록 조회는 막혀 있다)
 */
const IMAGE_BUCKET = "images";

let client: SupabaseClient | undefined;

// secret 키는 RLS를 무시하는 관리자 키라 서버에서만 쓴다. Storage가 필요할 때 처음 만든다
function getStorageClient() {
  if (!client) {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SECRET_KEY;
    if (!url || !key) throw new Error("SUPABASE_URL and SUPABASE_SECRET_KEY must be set");
    client = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  }
  return client;
}

/** 버킷 안의 음원 경로로 일정 시간만 유효한 재생 URL을 만든다 */
export async function createAudioUrl(path: string): Promise<string> {
  const { data, error } = await getStorageClient()
    .storage.from(AUDIO_BUCKET)
    .createSignedUrl(path, AUDIO_URL_TTL_SECONDS);
  if (error) throw new Error(`failed to sign audio "${path}": ${error.message}`);
  return data.signedUrl;
}

/** 여러 경로를 한 번에 서명한다. 파일이 없는 경로는 null */
export async function createAudioUrls(paths: string[]): Promise<Map<string, string | null>> {
  if (paths.length === 0) return new Map();
  const { data, error } = await getStorageClient()
    .storage.from(AUDIO_BUCKET)
    .createSignedUrls(paths, AUDIO_URL_TTL_SECONDS);
  if (error) throw new Error(`failed to sign audio: ${error.message}`);
  return new Map(data.map((item) => [item.path ?? "", item.error ? null : item.signedUrl]));
}

/** 이미지를 올리고 공개 URL을 돌려준다 (형식·크기 검사는 호출하는 쪽에서 한다) */
export async function uploadImage(file: File, extension: string): Promise<string> {
  const now = new Date();
  const path = `${now.getUTCFullYear()}/${String(now.getUTCMonth() + 1).padStart(2, "0")}/${randomUUID()}.${extension}`;
  const storage = getStorageClient().storage.from(IMAGE_BUCKET);
  const { error } = await storage.upload(path, file, { contentType: file.type, cacheControl: "31536000" });
  if (error) throw new Error(`failed to upload image "${path}": ${error.message}`);
  return storage.getPublicUrl(path).data.publicUrl;
}
