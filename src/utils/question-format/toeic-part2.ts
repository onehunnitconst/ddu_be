import { z } from "zod";
import { defineFormat } from "./spec";

export const toeicPart2ContentSchema = z.object({
  /** 음원으로 나오는 질문·진술의 영문 스크립트 */
  question: z.string().min(1),
  /** 음원으로 나오는 응답 (A)–(C)의 영문 스크립트 */
  options: z.array(z.string().min(1)).length(3),
  /** 한국어 해설 (정답 근거·해석), 없으면 null */
  explanation: z.string().min(1).nullable().default(null),
});

export type ToeicPart2Content = z.infer<typeof toeicPart2ContentSchema>;

/** 시험지에 인쇄되는 문구 그대로 */
const PART2_STEM = "Mark your answer on your answer sheet.";

const LABELS = "ABC";

/** 채점 후에만 보이도록 스크립트를 해설 앞에 붙인다 */
const scriptWithExplanation = ({ question, options, explanation }: ToeicPart2Content) => {
  const script = [
    "[스크립트]",
    `Q. ${question}`,
    ...options.map((text, index) => `(${LABELS[index]}) ${text}`),
  ].join("\n");
  return explanation ? `${script}\n\n[해설]\n${explanation}` : script;
};

/**
 * TOEIC Part 2(질의응답): 음원으로 질문 하나와 응답 (A)–(C)를 듣고 알맞은 응답을 고른다.
 * 실제 시험처럼 풀기 전에는 스크립트를 내려주지 않고 보기는 표기만 보이며, 스크립트는 해설에만 둔다.
 * 음원은 questions.audio_path로 연결한다.
 */
export const toeicPart2Format = defineFormat<ToeicPart2Content>({
  format: "TOEIC_PART2",
  contentSchema: toeicPart2ContentSchema,
  normalize: (content) => ({
    stem: { en: PART2_STEM, ko: null },
    // 풀이 기록에는 이미 채점한 문제만 나오므로 스크립트를 보여줘도 된다
    preview: { en: content.question, ko: null },
    exhibitImages: [],
    options: content.options.map(() => ({ text: { en: null, ko: null }, image: null })),
    explanation: { ko: scriptWithExplanation(content), en: null },
    answerNote: null,
  }),
  optionLabel: (index) => LABELS[index] ?? String(index + 1),
  answerCount: { min: 1, max: 1 },
  selection: () => ({ mode: "single" }),
  isCorrect: (answer, selected) => selected.length === 1 && selected[0] === answer[0],
});
