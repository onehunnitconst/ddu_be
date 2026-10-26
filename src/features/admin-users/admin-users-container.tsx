"use client";

import { AdminUsersView } from "./admin-users-view";
import { useAdminUsers } from "./use-admin-users";

export function AdminUsersContainer() {
  const viewModel = useAdminUsers();

  return <AdminUsersView {...viewModel} />;
}
