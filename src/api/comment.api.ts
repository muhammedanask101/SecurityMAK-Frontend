import api from "./axios";
import type {
  CaseComment,
  CreateCommentRequest,
} from "@/types/comment";

export const commentApi = {
  list: async (caseId: number): Promise<CaseComment[]> => {
    const res = await api.get<CaseComment[]>(
      `/api/cases/${caseId}/comments`
    );
    return res.data;
  },

  create: async (
    caseId: number,
    payload: CreateCommentRequest
  ): Promise<CaseComment> => {
    const res = await api.post<CaseComment>(
      `/api/cases/${caseId}/comments`,
      payload
    );
    return res.data;
  },

  delete: async (commentId: number): Promise<void> => {
    await api.delete(`/api/comments/${commentId}`);
  },
};
