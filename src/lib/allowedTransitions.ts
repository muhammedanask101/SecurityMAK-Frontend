import type { CaseStatus } from "@/types/case";

export const allowedTransitions: Record<
  CaseStatus,
  CaseStatus[]
> = {
  OPEN: ["IN_PROGRESS"],
  IN_PROGRESS: ["REVIEW"],
  REVIEW: ["CLOSED", "IN_PROGRESS"],
  CLOSED: ["ARCHIVED"],
  ARCHIVED: [],
};
