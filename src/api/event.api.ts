import api from "./axios";
import type {
  CaseEvent,
  CreateCaseEventRequest,
} from "@/types/event";

export const eventApi = {
  list: async (caseId: number): Promise<CaseEvent[]> => {
    const res = await api.get<CaseEvent[]>(
      `/api/cases/${caseId}/events`
    );
    return res.data;
  },

  create: async (
    caseId: number,
    payload: CreateCaseEventRequest
  ): Promise<void> => {
    await api.post(
      `/api/cases/${caseId}/events`,
      payload
    );
  },

  delete: async (caseId: number, eventId: number) => {
    await api.delete(`/api/cases/${caseId}/events/${eventId}`);
  }
};
