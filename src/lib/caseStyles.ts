import type { CaseStatus, SensitivityLevel } from "../types/case";


export const statusStyles: Record<CaseStatus, string> = {
  OPEN: "bg-gray-100 text-gray-700",
  IN_PROGRESS: "bg-blue-50 text-blue-700",
  REVIEW: "bg-purple-50 text-purple-700",
  CLOSED: "bg-green-50 text-green-700",
  ARCHIVED: "bg-gray-200 text-gray-500",
};

export const sensitivityStyles: Record<SensitivityLevel, string> = {
  LOW: "bg-green-50 text-green-700",
  MEDIUM: "bg-yellow-50 text-yellow-700",
  HIGH: "bg-orange-50 text-orange-700",
  CRITICAL: "bg-red-50 text-red-700",
};
