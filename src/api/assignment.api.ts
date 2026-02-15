import api from "./axios";
import type {
  CaseAssignment,
  CreateAssignmentRequest,
} from "@/types/assignment";

export const assignmentApi = {
  list: async (
    caseId: number
  ): Promise<CaseAssignment[]> => {
    const res = await api.get<CaseAssignment[]>(
      `/api/cases/${caseId}/assignments`
    );
    return res.data;
  },

  create: async (
    caseId: number,
    payload: CreateAssignmentRequest
  ): Promise<CaseAssignment> => {
    const res = await api.post<CaseAssignment>(
      `/api/cases/${caseId}/assignments`,
      payload
    );
    return res.data;
  },

  delete: async (caseId: number, id: number): Promise<void> => {
  await api.delete(`/api/cases/${caseId}/assignments/${id}`);
},

  complete: async (id: number): Promise<void> => {
    await api.patch(`/api/assignments/${id}/complete`);
  },
};
