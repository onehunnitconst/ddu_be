import type { Metadata } from "next";
import { AdminView } from "@/features/admin/admin-view";
import { AdminQuestionsContainer } from "@/features/admin-questions/admin-questions-container";
import { RequireAdmin } from "@/features/login-gate/require-admin";

export const metadata: Metadata = { title: "문제 관리 | 뚜비컨티뉴" };

export default function AdminQuestionsPage() {
  return (
    <RequireAdmin>
      <AdminView section="questions">
        <AdminQuestionsContainer />
      </AdminView>
    </RequireAdmin>
  );
}
