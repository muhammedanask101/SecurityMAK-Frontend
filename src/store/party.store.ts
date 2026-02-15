import { create } from "zustand";
import { partyApi } from "@/api/party.api";
import type {
  CaseParty,
  CreatePartyRequest,
} from "@/types/party";

interface PartyState {
  parties: CaseParty[];
  loading: boolean;

  fetchParties: (caseId: number) => Promise<void>;
  createParty: (
    caseId: number,
    payload: CreatePartyRequest
  ) => Promise<void>;
  deleteParty: (caseId: number, id: number) => Promise<void>;
}

export const usePartyStore = create<PartyState>(
  (set) => ({
    parties: [],
    loading: false,

    fetchParties: async (caseId) => {
      set({ loading: true });
      const data = await partyApi.list(caseId);
      set({ parties: data, loading: false });
    },

    createParty: async (caseId, payload: CreatePartyRequest) => {
      await partyApi.create(caseId, payload);
      const data = await partyApi.list(caseId);
      set({ parties: data });
    },

    deleteParty: async (caseId: number, partyId: number) => {
      await partyApi.delete(caseId, partyId);
      const data = await partyApi.list(caseId);
      set({ parties: data });
    },
  })
);
