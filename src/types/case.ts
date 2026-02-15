/* ===============================
   ENUM TYPES
=============================== */

export type CaseStatus =
  | "OPEN"
  | "IN_PROGRESS"
  | "REVIEW"
  | "CLOSED"
  | "ARCHIVED";

export type SensitivityLevel =
  | "LOW"
  | "MEDIUM"
  | "HIGH"
  | "CRITICAL";

/* ===============================
   CASE DTOs
=============================== */

export interface CaseResponse {
  id: number;
  title: string;
  description: string;
  status: CaseStatus;
  sensitivityLevel: SensitivityLevel; // MUST match backend
  ownerEmail: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string

  caseType?: string;
matterType?: string;
stage?: string;
courtLevel?: string;

courtName?: string;
state?: string;
district?: string;
caseNumber?: string;
judgeName?: string;

clientName?: string;
opposingPartyName?: string;
assignedAdvocate?: string;

filingDate?: string;
registrationDate?: string;
}

export interface CreateCaseRequest {
  title: string;
  description: string;
  sensitivityLevel: SensitivityLevel;
}

export interface UpdateCaseRequest {
  title: string;        // backend @NotBlank → required
  description: string;  // backend @NotBlank → required
}

/* ===============================
   COMMENTS
=============================== */

export interface CommentResponse {
  id: number;
  authorEmail: string;
  content: string;
  sensitivityLevel: SensitivityLevel;
  createdAt: string;
}

/* ===============================
   PAGINATION
=============================== */

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
}
