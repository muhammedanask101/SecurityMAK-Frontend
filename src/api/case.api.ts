import api from "./axios";

import type {
  CaseResponse,
  CreateCaseRequest,
  UpdateCaseRequest,
  PageResponse,
  CaseStatus,
  SensitivityLevel,
  CommentResponse,
} from "../types/case";

export const caseApi = {
  /* ===============================
     CASE FETCHING
  =============================== */

  // ADMIN - all tenant cases
getCases: async (
  page = 0,
  size = 20,
  filters?: {
    title?: string
    status?: string
    sensitivity?: string
  }
) => {
  const params: Record<string, string | number> = {
    page,
    size,
  }

  if (filters?.title) params.title = filters.title
  if (filters?.status) params.status = filters.status
  if (filters?.sensitivity) params.sensitivity = filters.sensitivity

  const res = await api.get<PageResponse<CaseResponse>>(
    "/api/cases",
    { params }
  )

  return res.data
},

  // USER - my cases
getMyCases: async (
  page = 0,
  size = 10,
  filters?: {
    title?: string
    status?: string
    sensitivity?: string
  }
) => {
  const params: Record<string, string | number> = {
    page,
    size,
  }

  if (filters?.title) params.title = filters.title
  if (filters?.status) params.status = filters.status
  if (filters?.sensitivity) params.sensitivity = filters.sensitivity

  const res = await api.get<PageResponse<CaseResponse>>(
    "/api/cases/my",
    { params }
  )

  return res.data
},

getCaseById: async (id: number) => {
  const res = await api.get<CaseResponse>(`/api/cases/${id}`);
  return res.data;
},

  /* ===============================
     CASE MUTATIONS
  =============================== */

  // CREATE case
  createCase: async (data: CreateCaseRequest) => {
    const res = await api.post<CaseResponse>("/api/cases", data);
    return res.data;
  },

  // USER update (title/description only)
  updateCase: async (id: number, data: UpdateCaseRequest) => {
    const res = await api.put<CaseResponse>(`/api/cases/${id}`, data);
    return res.data;
  },

  // ADMIN update status
  updateCaseStatus: async (id: number, newStatus: CaseStatus) => {
    const res = await api.put<CaseResponse>(
      `/api/cases/${id}/status`,
      { newStatus }
    );
    return res.data;
  },

  // ADMIN update sensitivity
  updateCaseSensitivity: async (
    id: number,
    level: SensitivityLevel
  ) => {
    const res = await api.patch<CaseResponse>(
      `/api/cases/${id}/sensitivity`,
      null,
      { params: { level } }
    );
    return res.data;
  },

  /* ===============================
     COMMENTS
  =============================== */

  getComments: async (caseId: number) => {
    const res = await api.get<CommentResponse[]>(
      `/api/cases/${caseId}/comments`
    );
    return res.data;
  },

  addComment: async (
    caseId: number,
    content: string,
    sensitivityLevel: SensitivityLevel
  ) => {
    const res = await api.post<CommentResponse>(
      `/api/cases/${caseId}/comments`,
      { content, sensitivityLevel }
    );
    return res.data;
  },

  // ADMIN delete comment
  deleteComment: async (commentId: number) => {
    await api.delete(`/api/comments/${commentId}`);
  },
};
