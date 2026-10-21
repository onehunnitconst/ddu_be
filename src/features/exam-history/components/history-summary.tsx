import type { HistoryResponse } from "@/types/exam";

type HistorySummaryProps = {
  summary: HistoryResponse["summary"];
  accuracy: number | null;
};

export function HistorySummary({ summary, accuracy }: HistorySummaryProps) {
  const stats = [
    { label: "푼 문제", value: `${summary.solvedQuestions} / ${summary.totalQuestions}` },
    { label: "총 풀이", value: `${summary.totalAttempts}회` },
    { label: "정답률", value: accuracy === null ? "-" : `${accuracy}%` },
  ];

  return (
    <dl className="grid grid-cols-3 gap-3">
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-lg border p-3">
          <dt className="text-xs text-muted-foreground">{stat.label}</dt>
          <dd className="mt-1 text-lg font-semibold">{stat.value}</dd>
        </div>
      ))}
    </dl>
  );
}
