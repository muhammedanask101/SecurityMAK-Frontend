import { create } from "zustand";
import { eventApi } from "@/api/event.api";
import type {
  CaseEvent,
  CreateCaseEventRequest,
} from "@/types/event";

interface EventState {
  events: CaseEvent[];
  loading: boolean;

  fetchEvents: (caseId: number) => Promise<void>;
  createEvent: (
    caseId: number,
    payload: CreateCaseEventRequest
  ) => Promise<void>;
  deleteEvent: (caseId: number, id: number) => Promise<void>;
  updateEvent: (
  caseId: number,
  eventId: number,
  payload: CreateCaseEventRequest
) => Promise<void>;
}

export const useEventStore = create<EventState>(
  (set) => ({
    events: [],
    loading: false,

    fetchEvents: async (caseId) => {
      set({ loading: true });
      const data = await eventApi.list(caseId);
      set({ events: data, loading: false });
    },

    createEvent: async (caseId, payload) => {
      await eventApi.create(caseId, payload);
      const data = await eventApi.list(caseId);
      set({ events: data });
    },

    deleteEvent: async (caseId, id) => {
  await eventApi.delete(caseId, id);
  const data = await eventApi.list(caseId);
  set({ events: data });
},

updateEvent: async (caseId, eventId, payload) => {
  await eventApi.update(caseId, eventId, payload);
  const data = await eventApi.list(caseId);
  set({ events: data });
},
  })
);
