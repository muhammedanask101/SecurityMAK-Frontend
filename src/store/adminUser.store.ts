import { create } from "zustand";
import { userApi} from "@/api/user.api";
import type { AdminUser } from "@/api/user.api";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { useAuthStore } from "./auth.store";
import { adminApi } from "@/api/admin.api";

interface AdminUserState {
  users: AdminUser[];
  loading: boolean;
  error: string | null;

  fetchUsers: () => Promise<void>;
  updateRole: (id: number, role: string) => Promise<void>;
  updateClearance: (id: number, level: string) => Promise<void>;

  banUser: (id: number) => Promise<void>;
  unbanUser: (id: number) => Promise<void>;
}

export const useAdminUserStore = create<AdminUserState>((set, get) => ({
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

    // 🔥 UPDATE AUTH STORE IF SELF
    const authStore = useAuthStore.getState();

    if (authStore.user?.id === id.toString()) {
      useAuthStore.setState({
        user: {
          ...authStore.user,
          role: updated.role,
          clearanceLevel: updated.clearanceLevel,
        },
      });
    }

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

  banUser: async (id: number) => {
  set({ loading: true });

  try {
    await adminApi.banUser(id, "Manual admin action");
    await get().fetchUsers();
  } catch (err: unknown) {
    set({
      error:
        getErrorMessage(err) ||
        "Ban failed",
    });
  } finally {
    set({ loading: false });
  }
},

unbanUser: async (id: number) => {
  set({ loading: true });

  try {
    await adminApi.unbanUser(id);
    await get().fetchUsers();
  } catch (err: unknown) {
    set({
      error:
        getErrorMessage(err) ||
        "Unban failed",
    });
  } finally {
    set({ loading: false });
  }
},
}));
