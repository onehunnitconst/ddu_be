"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/hooks/use-session";
import type { AdminUser } from "@/types/admin";
import { fetchAdminUsers, setAdminUserApproval } from "@/utils/admin-api";
import { ApiError } from "@/utils/api-client";
import { USER_FILTERS, type UserFilter } from "./constants";

const errorMessage = (error: unknown, fallback: string) => (error instanceof ApiError ? error.message : fallback);

/** 회원 관리: 회원 목록을 보고 가입을 승인하거나 승인을 취소한다 (관리자 지정은 CLI로만) */
export function useAdminUsers() {
  const { user: me } = useSession();
  const [users, setUsers] = useState<AdminUser[] | null>(null);
  const [filter, setFilter] = useState<UserFilter>("all");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ tone: "error" | "success"; text: string } | null>(null);

  // 응답이 온 뒤에만 상태를 바꾸고, 언마운트 후 도착한 응답은 버린다
  useEffect(() => {
    let ignore = false;
    fetchAdminUsers().then(
      (next) => !ignore && setUsers(next),
      (error) => !ignore && setMessage({ tone: "error", text: errorMessage(error, "회원 목록을 불러오지 못했습니다.") }),
    );
    return () => {
      ignore = true;
    };
  }, []);

  const setApproval = async (target: AdminUser, approved: boolean) => {
    if (busyId) return;
    if (!approved && !window.confirm(`${target.nickname}(${target.loginId}) 님의 승인을 취소할까요? 바로 로그아웃됩니다.`)) {
      return;
    }
    setBusyId(target.id);
    setMessage(null);
    try {
      const saved = await setAdminUserApproval(target.id, approved);
      setUsers((current) => current?.map((item) => (item.id === saved.id ? saved : item)) ?? null);
      setMessage({
        tone: "success",
        text: `${saved.nickname} 님을 ${approved ? "승인했습니다" : "승인 취소했습니다"}.`,
      });
    } catch (error) {
      setMessage({ tone: "error", text: errorMessage(error, "처리하지 못했습니다.") });
    } finally {
      setBusyId(null);
    }
  };

  const pendingCount = users?.filter((user) => user.approvedAt === null).length ?? 0;

  return {
    users: users && USER_FILTERS.find((item) => item.value === filter)!.matches(users),
    totalCount: users?.length ?? 0,
    pendingCount,
    filter,
    setFilter,
    myId: me?.id ?? null,
    busyId,
    message,
    approve: (user: AdminUser) => setApproval(user, true),
    revoke: (user: AdminUser) => setApproval(user, false),
  };
}

export type AdminUsersViewModel = ReturnType<typeof useAdminUsers>;
