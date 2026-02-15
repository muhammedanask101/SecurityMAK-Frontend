export interface CaseAssignment {
  id: number;
  userEmail: string;
  role: string;
  assignedAt: string;
}

export interface CreateAssignmentRequest {
  userEmail: string;
  role: string;
}