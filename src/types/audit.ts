export type AuditAction =
  | "CASE_CREATED"
  | "CASE_UPDATED"
  | "STATUS_CHANGED"
  | "SENSITIVITY_CHANGED"
  | "COMMENT_ADDED"
  | "COMMENT_DELETED"
  | "USER_ROLE_CHANGED"
  | "LOGIN"
  | "REGISTER";

export interface AuditLog {
  id: number;
  actorEmail: string;
  action: AuditAction;
  targetType: string;
  targetId: number;
  oldValue: string | null;
  newValue: string | null;
  timestamp: string;
}

export interface AuditPageResponse {
  content: AuditLog[];
  number: number;
  totalPages: number;
  totalElements: number;
}
