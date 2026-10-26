import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";
import { USER_FILTERS, userDateFormat } from "./constants";
import type { AdminUsersViewModel } from "./use-admin-users";

type AdminUsersViewProps = AdminUsersViewModel;

const formatDate = (value: string) => userDateFormat.format(new Date(value));

export function AdminUsersView({
  users,
  totalCount,
  pendingCount,
  filter,
  setFilter,
  myId,
  busyId,
  message,
  approve,
  revoke,
}: AdminUsersViewProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex gap-1" role="group" aria-label="회원 필터">
          {USER_FILTERS.map((item) => (
            <Button
              key={item.value}
              size="sm"
              variant={filter === item.value ? "secondary" : "ghost"}
              aria-pressed={filter === item.value}
              onClick={() => setFilter(item.value)}
            >
              {item.label} {item.value === "pending" ? pendingCount : totalCount}
            </Button>
          ))}
        </div>
      </div>

      {message && (
        <p
          role={message.tone === "error" ? "alert" : "status"}
          className={cn("text-sm", message.tone === "error" ? "text-destructive" : "text-green-700 dark:text-green-400")}
        >
          {message.text}
        </p>
      )}

      {users === null ? (
        !message && <p className="py-12 text-center text-sm text-muted-foreground">회원 목록을 불러오는 중…</p>
      ) : users.length === 0 ? (
        <p className="rounded-lg border p-8 text-center text-sm text-muted-foreground">
          {filter === "pending" ? "승인을 기다리는 회원이 없습니다." : "회원이 없습니다."}
        </p>
      ) : (
        <ul className="flex flex-col divide-y rounded-lg border">
          {users.map((user) => {
            const approved = user.approvedAt !== null;
            const busy = busyId === user.id;
            return (
              <li key={user.id} className="flex flex-col gap-3 p-3 text-sm sm:flex-row sm:items-center sm:gap-4">
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold">{user.nickname}</span>
                    <span className="text-muted-foreground">{user.loginId}</span>
                    <Badge variant={approved ? "secondary" : "destructive"}>{approved ? "승인" : "승인 대기"}</Badge>
                    {user.isAdmin && <Badge variant="outline">관리자</Badge>}
                    {user.id === myId && <Badge variant="outline">나</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    가입 {formatDate(user.createdAt)}
                    {user.approvedAt && ` · 승인 ${formatDate(user.approvedAt)}`}
                    {" · "}
                    {user.attempts > 0
                      ? `풀이 ${user.attempts}회 (최근 ${formatDate(user.lastAttemptAt!)})`
                      : "풀이 기록 없음"}
                  </p>
                </div>
                <div className="flex shrink-0 justify-end">
                  {approved ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => revoke(user)}
                      disabled={busyId !== null || user.id === myId}
                      title={user.id === myId ? "자기 자신의 승인은 취소할 수 없습니다" : undefined}
                    >
                      {busy ? "처리 중…" : "승인 취소"}
                    </Button>
                  ) : (
                    <Button size="sm" onClick={() => approve(user)} disabled={busyId !== null}>
                      {busy ? "처리 중…" : "승인"}
                    </Button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
