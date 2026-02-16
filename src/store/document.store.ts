import { create } from "zustand";
import { documentApi } from "@/api/document.api";
import type {
  CaseDocumentGroup,
  SensitivityLevel,
} from "@/types/document";
import { getErrorMessage } from "@/lib/getErrorMessage";

interface DocumentState {
  documents: CaseDocumentGroup[];
  loading: boolean;
  error: string | null;

  fetchDocuments: (caseId: number) => Promise<void>;

  uploadDocument: (
    caseId: number,
    file: File,
    sensitivity: SensitivityLevel,
    documentGroupId?: string // ✅ optional for versioning
  ) => Promise<void>;

  deleteDocument: (
    caseId: number,
    documentId: number
  ) => Promise<void>;

  updateGroupSensitivity: (
  caseId: number,
  groupId: string,
  sensitivity: SensitivityLevel
) => Promise<void>;
}

export const useDocumentStore = create<DocumentState>((set) => ({
  documents: [],
  loading: false,
  error: null,

  /* ===============================
     FETCH DOCUMENT GROUPS
     =============================== */
  fetchDocuments: async (caseId) => {
    set({ loading: true, error: null });

    try {
      const data = await documentApi.list(caseId);
      set({ documents: data, loading: false });
    } catch (err) {
      set({
        error: getErrorMessage(err),
        loading: false,
      });
    }
  },

  /* ===============================
     UPLOAD (NEW OR VERSION)
     =============================== */
  uploadDocument: async (
    caseId,
    file,
    sensitivity,
    documentGroupId
  ) => {
    set({ loading: true, error: null });

    try {
      await documentApi.upload(
        caseId,
        file,
        sensitivity,
        documentGroupId // ✅ forwarded
      );

      const updated = await documentApi.list(caseId);

      set({
        documents: updated,
        loading: false,
      });
    } catch (err) {
      set({
        error: getErrorMessage(err),
        loading: false,
      });
    }
  },

  /* ===============================
     DELETE DOCUMENT (ADMIN)
     =============================== */
  deleteDocument: async (caseId, documentId) => {
    set({ loading: true, error: null });

    try {
      await documentApi.delete(caseId, documentId);

      const updated = await documentApi.list(caseId);

      set({
        documents: updated,
        loading: false,
      });
    } catch (err) {
      set({
        error: getErrorMessage(err),
        loading: false,
      });
    }
  },

  updateGroupSensitivity: async (
  caseId,
  groupId,
  sensitivity
) => {
  set({ loading: true, error: null });

  try {
    await documentApi.updateGroupSensitivity(
      caseId,
      groupId,
      sensitivity
    );

    const updated = await documentApi.list(caseId);

    set({
      documents: updated,
      loading: false,
    });
  } catch (err) {
    set({
      error: getErrorMessage(err),
      loading: false,
    });
  }
},
}));
