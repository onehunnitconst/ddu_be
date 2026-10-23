import type { ComponentProps, ElementType } from "react";
import ReactMarkdown, { type Components, type ExtraProps } from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkCjkFriendly from "remark-cjk-friendly";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import "katex/dist/katex.min.css";
import { cn } from "@/utils/cn";

type MarkdownProps = {
  text: string;
  className?: string;
};

/** 마크다운 요소를 클래스가 지정된 태그로 렌더링한다 (react-markdown이 넘기는 hast `node`는 DOM에 넘기지 않는다) */
const styled = <T extends ElementType>(Tag: T, className: string) =>
  function StyledElement({ node, className: extra, ...props }: ComponentProps<T> & ExtraProps) {
    void node;
    const Element = Tag as ElementType;
    return <Element className={cn(className, extra)} {...props} />;
  };

// 카드처럼 좁은 영역에 맞춘 간결한 스타일 (typography 플러그인 없이 요소별로 지정)
const COMPONENTS: Components = {
  h1: styled("h3", "mt-3 font-semibold first:mt-0"),
  h2: styled("h4", "mt-3 font-semibold first:mt-0"),
  h3: styled("h5", "mt-3 font-semibold first:mt-0"),
  p: styled("p", "mt-2 first:mt-0"),
  ul: styled("ul", "mt-2 list-disc space-y-0.5 pl-5 first:mt-0"),
  ol: styled("ol", "mt-2 list-decimal space-y-0.5 pl-5 first:mt-0"),
  blockquote: styled("blockquote", "mt-2 border-l-2 pl-3 text-muted-foreground first:mt-0"),
  a: ({ node, ...props }) => {
    void node;
    return <a className="text-primary underline underline-offset-2" target="_blank" rel="noreferrer" {...props} />;
  },
  pre: styled(
    "pre",
    "mt-2 overflow-x-auto rounded-md bg-muted p-2 font-mono text-xs first:mt-0 [&_code]:bg-transparent [&_code]:p-0 [&_code]:text-foreground",
  ),
  code: styled("code", "rounded bg-muted px-1 py-0.5 font-mono text-[0.85em] text-rose-600 dark:text-rose-400"),
  table: ({ node, ...props }) => {
    void node;
    return (
      <div className="mt-2 overflow-x-auto first:mt-0">
        <table className="w-full border-collapse text-xs" {...props} />
      </div>
    );
  },
  th: styled("th", "border bg-muted px-2 py-1 text-left font-medium"),
  td: styled("td", "border px-2 py-1"),
};

/**
 * 마크다운(GFM: 표·체크리스트·취소선 포함)을 렌더링한다. raw HTML은 렌더링하지 않는다.
 * 수식은 TeX(KaTeX): 인라인은 `$...$`, 블록은 `$$`를 앞뒤 줄에 따로 둔다. 일반 텍스트의 달러 기호는 `\$`로 쓴다.
 * `**용어(설명)**은`처럼 강조가 문장부호로 끝나고 한글이 바로 붙어도 굵게 되도록 remark-cjk-friendly를 쓴다
 */
export function Markdown({ text, className }: MarkdownProps) {
  return (
    // 블록 수식이 좁은 카드보다 넓으면 가로로 스크롤한다
    <div className={cn("break-words [&_.katex-display]:my-2 [&_.katex-display]:overflow-x-auto [&_.katex-display]:py-1", className)}>
      <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath, remarkCjkFriendly]} rehypePlugins={[rehypeKatex]} components={COMPONENTS}>
        {text}
      </ReactMarkdown>
    </div>
  );
}
