import { cn } from "@/utils/cn";

type RichTextProps = {
  text: string;
  className?: string;
};

/**
 * 문제 데이터의 텍스트를 렌더링한다.
 * `백틱`으로 감싼 부분은 코드로, 줄바꿈(JSON 정책 등)은 그대로 보여준다.
 */
export function RichText({ text, className }: RichTextProps) {
  const parts = text.split(/(`[^`\n]+`)/g);

  return (
    <span className={cn("whitespace-pre-wrap break-words", className)}>
      {parts.map((part, index) =>
        part.startsWith("`") && part.endsWith("`") && part.length > 2 ? (
          <code key={index} className="rounded bg-muted px-1 py-0.5 font-mono text-[0.9em]">
            {part.slice(1, -1)}
          </code>
        ) : (
          part
        ),
      )}
    </span>
  );
}
