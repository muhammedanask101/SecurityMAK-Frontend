import { create } from "zustand";
import { userApi} from "@/api/user.api";
import type { AdminUser } from "@/api/user.api";
import { getErrorMessage } from "@/lib/getErrorMessage";

interface AdminUserState {
  users: AdminUser[];
  loading: boolean;
  error: string | null;

  fetchUsers: () => Promise<void>;
  updateRole: (id: number, role: string) => Promise<void>;
  updateClearance: (id: number, level: string) => Promise<void>;
}

export const useAdminUserStore = create<AdminUserState>((set) => ({
  users: [],
  loading: false,
  error: null,

  fetchUsers: async () => {
    set({ loading: true, error: null });
    try {
      const data = await userApi.getUsers();
      set({ users: data, loading: false });
    } catch (err: unknown) {
      set({
        error: getErrorMessage(err),
        loading: false,
      });
    }
  },

  updateRole: async (id, role) => {
    set({ loading: true });
    try {
      const updated = await userApi.updateRole(id, role);

      set((state) => ({
        users: state.users.map((u) =>
          u.id === id ? updated : u
        ),
        loading: false,
      }));
    } catch (err: unknown) {
      set({
        error: getErrorMessage(err),
        loading: false,
      });
    }
  },

  updateClearance: async (id, level) => {
    set({ loading: true });
    try {
      const updated = await userApi.updateClearance(id, level);

      set((state) => ({
        users: state.users.map((u) =>
          u.id === id ? updated : u
        ),
        loading: false,
      }));
    } catch (err: unknown) {
      set({
        error: getErrorMessage(err),
        loading: false,
      });
    }
  },
}));
