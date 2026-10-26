"use client";

import { json } from "@codemirror/lang-json";
import { markdown } from "@codemirror/lang-markdown";
import { EditorView } from "@codemirror/view";
import { ImagePlusIcon } from "lucide-react";
import dynamic from "next/dynamic";
import { useMemo, useRef, useState, type ClipboardEvent, type DragEvent } from "react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { uploadAdminImage } from "@/utils/admin-api";
import { ApiError } from "@/utils/api-client";
import { cn } from "@/utils/cn";

// 에디터는 관리 화면에서만 쓰므로 필요할 때 불러오고, 서버에서는 그리지 않는다
const CodeMirror = dynamic(() => import("@uiw/react-codemirror"), {
  ssr: false,
  loading: () => <div className="h-40 animate-pulse rounded-lg border bg-muted/40" />,
});

const LANGUAGES = { json, markdown } as const;

type ImageUploadEditorProps = {
  value: string;
  onValueChange: (value: string) => void;
  /** 구문 강조할 언어 */
  language: keyof typeof LANGUAGES;
  /** 화면 읽기 프로그램용 이름 (위에 보이는 라벨과 같게) */
  ariaLabel: string;
  /** 올린 이미지 URL을 커서 위치에 넣을 글로 바꾼다 (예: 마크다운 `![](url)`) */
  formatImage: (url: string) => string;
  /** 처음 보이는 높이 (내용이 길면 최대 70vh까지 늘어난 뒤 스크롤) */
  minHeight?: string;
  invalid?: boolean;
  /** 버튼 옆에 보일 안내 */
  hint?: string;
};

/**
 * 구문 강조(CodeMirror) 에디터에 이미지 올리기를 더한 입력 상자.
 * "이미지 넣기" 버튼, 붙여넣기(캡처 이미지), 끌어다 놓기를 지원하고, 올린 파일은 Storage images 버킷에 저장된다.
 */
export function ImageUploadEditor({
  value,
  onValueChange,
  language,
  ariaLabel,
  formatImage,
  minHeight = "16rem",
  invalid = false,
  hint,
}: ImageUploadEditorProps) {
  const { theme } = useTheme();
  const viewRef = useRef<EditorView | null>(null);
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
        const view = viewRef.current;
        // 업로드하는 동안 입력이 바뀌었을 수 있어, 넣는 시점의 커서(선택 영역)를 기준으로 한다
        if (view) {
          view.dispatch(view.state.replaceSelection(text));
          view.focus();
        } else {
          onValueChange(value + text);
        }
      } catch (uploadError) {
        setError(uploadError instanceof ApiError ? uploadError.message : "이미지를 올리지 못했습니다.");
      } finally {
        setUploading((count) => count - 1);
      }
    }
  };

  const extensions = useMemo(
    () => [
      LANGUAGES[language](),
      EditorView.lineWrapping,
      EditorView.contentAttributes.of({ "aria-label": ariaLabel }),
    ],
    [language, ariaLabel],
  );

  // 이미지 붙여넣기·끌어다 놓기는 CodeMirror보다 먼저(capture 단계에서) 가로채고, 그 밖의 경우는 에디터에 맡긴다
  const onPasteCapture = (event: ClipboardEvent<HTMLDivElement>) => {
    const files = Array.from(event.clipboardData.files);
    if (!files.some((file) => file.type.startsWith("image/"))) return;
    event.preventDefault();
    event.stopPropagation();
    void upload(files);
  };
  const onDropCapture = (event: DragEvent<HTMLDivElement>) => {
    const files = Array.from(event.dataTransfer.files);
    if (files.length === 0) return;
    event.preventDefault();
    event.stopPropagation();
    // 놓은 위치로 커서를 옮겨 두면 업로드가 끝난 뒤 그 자리에 들어간다
    const view = viewRef.current;
    const position = view?.posAtCoords({ x: event.clientX, y: event.clientY });
    if (view && position != null) view.dispatch({ selection: { anchor: position } });
    void upload(files);
  };

  return (
    <div className="flex flex-col gap-1.5">
      <div
        onPasteCapture={onPasteCapture}
        onDropCapture={onDropCapture}
        className={cn(
          "overflow-hidden rounded-lg border border-input text-sm focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 [&_.cm-editor]:outline-none",
          invalid && "border-destructive",
        )}
      >
        <CodeMirror
          value={value}
          onChange={onValueChange}
          extensions={extensions}
          theme={theme === "dark" ? "dark" : "light"}
          minHeight={minHeight}
          maxHeight="70vh"
          basicSetup={{ foldGutter: false, highlightActiveLine: false }}
          onCreateEditor={(view) => {
            viewRef.current = view;
          }}
        />
      </div>
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
