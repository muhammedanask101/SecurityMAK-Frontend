import api from "./axios";

export interface AdminUser {
  id: number;
  email: string;
  role: string;
  clearanceLevel: string;
  organizationName: string;
  enabled: boolean;
}

export const userApi = {
  getUsers: async (): Promise<AdminUser[]> => {
    const res = await api.get("/api/admin/users");
    return res.data;
  },

  updateRole: async (id: number, role: string) => {
    const res = await api.put(`/api/admin/users/${id}/role`, { role });
    return res.data;
  },

  updateClearance: async (
    id: number,
    clearanceLevel: string
  ) => {
    const res = await api.put(
      `/api/admin/users/${id}/clearance`,
      { clearanceLevel }
    );
    return res.data;
  },
};

export function changePassword(data: {
  currentPassword: string;
  newPassword: string;
}) {
  return api.put("/api/users/change-password", data);
}

export function getProfile() {
  return api.get("/api/users/profile");
}