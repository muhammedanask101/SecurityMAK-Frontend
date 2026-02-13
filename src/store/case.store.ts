// store/useCaseStore.ts

import { create } from "zustand";
import { caseApi } from "../api/case.api";
import type {
  CaseResponse,
  CreateCaseRequest,
  UpdateCaseRequest,
  CaseStatus,
  SensitivityLevel,
} from "../types/case";
import { getErrorMessage } from "../lib/getErrorMessage";

interface CaseState {
  cases: CaseResponse[];
  selectedCase: CaseResponse | null;

  page: number;
  totalPages: number;
  totalElements: number;

  loading: boolean;
  error: string | null;

  fetchCases: (
    page?: number,
    size?: number,
    filters?: {
      title?: string;
      status?: string;
      sensitivity?: string;
    }
  ) => Promise<void>;

  fetchMyCases: (
    page?: number,
    size?: number,
    filters?: {
      title?: string;
      status?: string;
      sensitivity?: string;
    }
  ) => Promise<void>;

  fetchCaseById: (id: number) => Promise<void>;
  createCase: (data: CreateCaseRequest) => Promise<void>;
  updateCase: (id: number, data: UpdateCaseRequest) => Promise<void>;
  updateCaseStatus: (id: number, status: CaseStatus) => Promise<void>;
  updateCaseSensitivity: (
    id: number,
    level: SensitivityLevel
  ) => Promise<void>;

  clearSelectedCase: () => void;
}

export const useCaseStore = create<CaseState>((set) => ({
  cases: [],
  selectedCase: null,

  page: 0,
  totalPages: 0,
  totalElements: 0,

  loading: false,
  error: null,

  /* ===============================
     FETCH ALL (ADMIN)
  =============================== */
fetchCases: async (page = 0, size = 20, filters) => {
  set({ loading: true, error: null });

  try {
    const data = await caseApi.getCases(page, size, filters);

    set({
      cases: data.content,
      page: data.number,
      totalPages: data.totalPages,
      totalElements: data.totalElements,
      loading: false,
    });
  } catch (err: unknown) {
    set({
      error: getErrorMessage(err),
      loading: false,
    });
  }
},

fetchMyCases: async (page = 0, size = 10, filters) => {
  set({ loading: true, error: null });

  try {
    const data = await caseApi.getMyCases(page, size, filters);

    set({
      cases: data.content,
      page: data.number,
      totalPages: data.totalPages,
      totalElements: data.totalElements,
      loading: false,
    });
  } catch (err: unknown) {
    set({
      error: getErrorMessage(err),
      loading: false,
    });
  }
},

  /* ===============================
     FETCH ONE
  =============================== */
  fetchCaseById: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const data = await caseApi.getCaseById(id);
      set({ selectedCase: data, loading: false });
    } catch (err: unknown) {
      set({
        error: getErrorMessage(err),
        loading: false,
      });
    }
  },

  /* ===============================
     CREATE
  =============================== */
  createCase: async (data) => {
    set({ loading: true, error: null });
    try {
      const newCase = await caseApi.createCase(data);
      set((state) => ({
        cases: [newCase, ...state.cases],
        loading: false,
      }));
    } catch (err: unknown) {
      set({
        error: getErrorMessage(err),
        loading: false,
      });
    }
  },

  /* ===============================
     USER UPDATE (title/description)
  =============================== */
  updateCase: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const updated = await caseApi.updateCase(id, data);

      set((state) => ({
        cases: state.cases.map((c) =>
          c.id === id ? updated : c
        ),
        selectedCase:
          state.selectedCase?.id === id
            ? updated
            : state.selectedCase,
        loading: false,
      }));
    } catch (err: unknown) {
      set({
        error: getErrorMessage(err),
        loading: false,
      });
    }
  },

  /* ===============================
     ADMIN STATUS UPDATE
  =============================== */
  updateCaseStatus: async (id, status) => {
    set({ loading: true, error: null });
    try {
      const updated = await caseApi.updateCaseStatus(id, status);

      set((state) => ({
        cases: state.cases.map((c) =>
          c.id === id ? updated : c
        ),
        selectedCase:
          state.selectedCase?.id === id
            ? updated
            : state.selectedCase,
        loading: false,
      }));
    } catch (err: unknown) {
      set({
        error: getErrorMessage(err),
        loading: false,
      });
    }
  },

  /* ===============================
     ADMIN SENSITIVITY UPDATE
  =============================== */
  updateCaseSensitivity: async (id, level) => {
    set({ loading: true, error: null });
    try {
      const updated = await caseApi.updateCaseSensitivity(
        id,
        level
      );

      set((state) => ({
        cases: state.cases.map((c) =>
          c.id === id ? updated : c
        ),
        selectedCase:
          state.selectedCase?.id === id
            ? updated
            : state.selectedCase,
        loading: false,
      }));
    } catch (err: unknown) {
      set({
        error: getErrorMessage(err),
        loading: false,
      });
    }
  },

  clearSelectedCase: () => {
    set({ selectedCase: null });
  },
}));
