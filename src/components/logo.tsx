import { BookOpenTextIcon } from "lucide-react";
import { cn } from "@/utils/cn";

/** 로고 마크: 둥근 모서리 사각형 안의 책 아이콘 (테마 primary 색) */
export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground",
        className,
      )}
    >
      <BookOpenTextIcon className="size-5" />
    </span>
  );
}
