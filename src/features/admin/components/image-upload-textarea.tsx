"use client";

import { ImagePlusIcon } from "lucide-react";
import { useRef, useState, type ComponentProps } from "react";
import { Button } from "@/components/ui/button";
import { uploadAdminImage } from "@/utils/admin-api";
import { ApiError } from "@/utils/api-client";
import { cn } from "@/utils/cn";
import { TEXTAREA_CLASS } from "../constants";

type ImageUploadTextareaProps = Omit<ComponentProps<"textarea">, "value" | "onChange"> & {
  value: string;
  onValueChange: (value: string) => void;
  /** 올린 이미지 URL을 커서 위치에 넣을 글로 바꾼다 (예: 마크다운 `![](url)`) */
  formatImage: (url: string) => string;
  /** 버튼 옆에 보일 안내 */
  hint?: string;
};

/**
 * 이미지를 올려 커서 위치에 넣을 수 있는 입력 상자.
 * "이미지 넣기" 버튼, 붙여넣기(캡처 이미지), 끌어다 놓기를 지원하고, 올린 파일은 Storage images 버킷에 저장된다.
 */
export function ImageUploadTextarea({
  value,
  onValueChange,
  formatImage,
  hint,
  className,
  ...props
}: ImageUploadTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const upload = async (files: File[]) => {
    const images = files.filter((file) => file.type.startsWith("image/"));
    if (images.length === 0) return;
    setError(null);
    setUploading((count) => count + images.length);
    for (const file of images) {
      try {
        const text = formatImage(await uploadAdminImage(file));
        // 업로드하는 동안 입력이 바뀌었을 수 있어, 넣는 시점의 값과 커서를 기준으로 한다
        const textarea = textareaRef.current;
        const current = textarea?.value ?? value;
        const start = textarea?.selectionStart ?? current.length;
        const end = textarea?.selectionEnd ?? current.length;
        onValueChange(current.slice(0, start) + text + current.slice(end));
        requestAnimationFrame(() => textarea?.setSelectionRange(start + text.length, start + text.length));
      } catch (uploadError) {
        setError(uploadError instanceof ApiError ? uploadError.message : "이미지를 올리지 못했습니다.");
      } finally {
        setUploading((count) => count - 1);
      }
    }
  };

  return (
    <div className="flex flex-col gap-1.5">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
        onPaste={(event) => {
          const files = Array.from(event.clipboardData.files);
          if (files.some((file) => file.type.startsWith("image/"))) {
            event.preventDefault();
            void upload(files);
          }
        }}
        onDragOver={(event) => {
          if (event.dataTransfer.types.includes("Files")) event.preventDefault();
        }}
        onDrop={(event) => {
          const files = Array.from(event.dataTransfer.files);
          if (files.length === 0) return;
          event.preventDefault();
          textareaRef.current?.focus();
          void upload(files);
        }}
        className={cn(TEXTAREA_CLASS, className)}
        {...props}
      />
      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading > 0}
        >
          <ImagePlusIcon />
          {uploading > 0 ? "올리는 중…" : "이미지 넣기"}
        </Button>
        <span>{hint ?? "붙여넣기나 끌어다 놓기로도 넣을 수 있습니다 (PNG·JPEG·WebP·GIF, 5MB 이하)."}</span>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          multiple
          hidden
          onChange={(event) => {
            void upload(Array.from(event.target.files ?? []));
            event.target.value = "";
          }}
        />
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
