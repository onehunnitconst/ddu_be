"use client";

import { useState } from "react";
import type { ExamTab } from "./constants";

export function useExam() {
  const [tab, setTab] = useState<ExamTab>("practice");

  return { tab, setTab };
}
