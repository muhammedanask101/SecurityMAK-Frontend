import { create } from "zustand";
import { assignmentApi } from "@/api/assignment.api";
import type {
  CaseAssignment,
  CreateAssignmentRequest,
} from "@/types/assignment";

interface AssignmentState {
  assignments: CaseAssignment[];
  loading: boolean;

  fetchAssignments: (caseId: number) => Promise<void>;
  createAssignment: (
    caseId: number,
    payload: CreateAssignmentRequest
  ) => Promise<void>;
  deleteAssignment: (
    caseId: number,
    id: number
  ) => Promise<void>;
}

export const useAssignmentStore =
  create<AssignmentState>((set) => ({
    assignments: [],
    loading: false,

    fetchAssignments: async (caseId) => {
      set({ loading: true });
      const data = await assignmentApi.list(caseId);
      set({ assignments: data, loading: false });
    },

    createAssignment: async (caseId, payload) => {
      await assignmentApi.create(caseId, payload);
      const data = await assignmentApi.list(caseId);
      set({ assignments: data });
    },

    deleteAssignment: async (caseId, id) => {
  await assignmentApi.delete(caseId, id);
  const data = await assignmentApi.list(caseId);
  set({ assignments: data });
},
  }));
