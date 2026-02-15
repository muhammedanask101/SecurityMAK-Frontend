import api from "./axios";
import type { InviteStatus } from "../types/invite";

export interface CreateInviteRequest {
  email: string;
  role: string;
  clearanceLevel: string;
}

export const inviteApi = {
  createInvite: (data: CreateInviteRequest) =>
    api.post("/api/invites", data),

  getInvites: (status?: InviteStatus, page = 0, size = 10) =>
    api.get("/api/invites", {
      params: { status, page, size },
    }),

  approveInvite: (id: number) =>
    api.post(`/api/invites/${id}/approve`),

  rejectInvite: (id: number) =>
    api.post(`/api/invites/${id}/reject`),

  terminateInvite: (id: number) =>
    api.post(`/api/invites/${id}/terminate`),

  deleteInvite: (id: number) =>
    api.delete(`/api/invites/${id}`),

  acceptInvite(data: {
  token: string;
  email: string;
  password: string;
    }) {
    return api.post("/api/invites/accept", data);
    }
};
