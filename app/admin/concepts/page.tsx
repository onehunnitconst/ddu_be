import type { Metadata } from "next";
import { AdminView } from "@/features/admin/admin-view";
import { AdminConceptsContainer } from "@/features/admin-concepts/admin-concepts-container";
import { RequireAdmin } from "@/features/login-gate/require-admin";

export const metadata: Metadata = { title: "개념 관리 | 뚜비컨티뉴" };

export default function AdminConceptsPage() {
  return (
    <RequireAdmin>
      <AdminView section="concepts">
        <AdminConceptsContainer />
      </AdminView>
    </RequireAdmin>
  );
}
