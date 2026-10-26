"use client";

import { AdminConceptsView } from "./admin-concepts-view";
import { useAdminConcepts } from "./use-admin-concepts";

export function AdminConceptsContainer() {
  const viewModel = useAdminConcepts();

  return <AdminConceptsView {...viewModel} />;
}
