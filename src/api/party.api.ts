import api from "./axios";
import type {
  CaseParty,
  CreatePartyRequest,
} from "@/types/party";

export const partyApi = {
  list: async (
    caseId: number
  ): Promise<CaseParty[]> => {
    const res = await api.get<CaseParty[]>(
      `/api/cases/${caseId}/parties`
    );
    return res.data;
  },

  create: async (
    caseId: number,
    payload: CreatePartyRequest
  ): Promise<void> => {
    await api.post(
      `/api/cases/${caseId}/parties`,
      payload
    );
  },

  delete: async (caseId: number, partyId: number) => {
    await api.delete(`/api/cases/${caseId}/parties/${partyId}`);
  },

  update: async (
  caseId: number,
  partyId: number,
  payload: CreatePartyRequest
): Promise<void> => {
  await api.put(
    `/api/cases/${caseId}/parties/${partyId}`,
    payload
  );
},
};
