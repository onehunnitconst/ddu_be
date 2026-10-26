/** 풀이 시각 표기 (예: 10월 26일 오후 09:15) */
export const historyDateFormat = new Intl.DateTimeFormat("ko-KR", {
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});
