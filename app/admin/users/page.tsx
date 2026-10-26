import type { Metadata } from "next";
import { AdminView } from "@/features/admin/admin-view";
import { AdminUsersContainer } from "@/features/admin-users/admin-users-container";
import { RequireAdmin } from "@/features/login-gate/require-admin";

export const metadata: Metadata = { title: "회원 관리 | 뚜비컨티뉴" };

export default function AdminUsersPage() {
  return (
    <RequireAdmin>
      <AdminView section="users">
        <AdminUsersContainer />
      </AdminView>
    </RequireAdmin>
  );
}
