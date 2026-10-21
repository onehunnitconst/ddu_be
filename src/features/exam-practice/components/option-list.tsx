import { CheckIcon, XIcon } from "lucide-react";
import { RichText } from "@/components/rich-text";
import type { QuestionOption } from "@/types/question";
import { cn } from "@/utils/cn";
import { pickText, type Language } from "@/utils/localized-text";
import { optionState, type OptionState } from "../utils/selection";
import { ExamImage } from "./exam-image";

type OptionListProps = {
  options: QuestionOption[];
  selected: number[];
  /** 공개된 정답 (공개 전 null) */
  answer: number[] | null;
  multiple: boolean;
  disabled: boolean;
  language: Language;
  onToggle: (index: number) => void;
};

const STATE_CLASS: Record<OptionState, string> = {
  idle: "border-border hover:bg-muted/60",
  selected: "border-primary bg-primary/5 ring-1 ring-primary",
  correct: "border-green-600 bg-green-50 ring-1 ring-green-600 dark:bg-green-950/40",
  missed: "border-green-600 border-dashed bg-green-50/60 dark:bg-green-950/20",
  wrong: "border-red-500 bg-red-50 ring-1 ring-red-500 dark:bg-red-950/40",
};

export function OptionList({
  options,
  selected,
  answer,
  multiple,
  disabled,
  language,
  onToggle,
}: OptionListProps) {
  return (
    <ul className="flex flex-col gap-2" role={multiple ? "group" : "radiogroup"}>
      {options.map((option) => {
        const state = optionState(option.index, selected, answer);
        return (
          <li key={option.index}>
            <button
              type="button"
              role={multiple ? "checkbox" : "radio"}
              aria-checked={selected.includes(option.index)}
              disabled={disabled}
              onClick={() => onToggle(option.index)}
              className={cn(
                "flex w-full items-start gap-3 rounded-lg border p-3 text-left text-sm transition-colors disabled:cursor-default",
                STATE_CLASS[state],
              )}
            >
              <span
                className={cn(
                  "flex size-6 shrink-0 items-center justify-center rounded-full border text-xs font-semibold",
                  state === "selected" && "border-primary bg-primary text-primary-foreground",
                  (state === "correct" || state === "missed") && "border-green-600 bg-green-600 text-white",
                  state === "wrong" && "border-red-500 bg-red-500 text-white",
                )}
              >
                {state === "correct" ? (
                  <CheckIcon className="size-3.5" />
                ) : state === "wrong" ? (
                  <XIcon className="size-3.5" />
                ) : (
                  option.label
                )}
              </span>
              <span className="flex min-w-0 flex-1 flex-col gap-2 pt-0.5">
                <RichText text={pickText(option.text, language)} />
                {option.image && (
                  <ExamImage src={option.image} alt={`보기 ${option.label} 이미지`} />
                )}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
