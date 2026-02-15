export interface CaseComment {
  id: number;
  authorEmail: string;
  content: string;
  sensitivityLevel: string;
  createdAt: string;
}

export interface CreateCommentRequest {
  content: string;
  sensitivityLevel: string;
}
