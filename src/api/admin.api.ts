import api from "./axios";

export const adminApi = {
  banUser: async (
    userId: number,
    reason?: string
  ): Promise<void> => {
    await api.patch(
      `/api/admin/users/${userId}/ban`,
      null,
      {
        params: { reason },
      }
    );
  },

  unbanUser: async (
    userId: number
  ): Promise<void> => {
    await api.patch(
      `/api/admin/users/${userId}/unban`
    );
  },
};
