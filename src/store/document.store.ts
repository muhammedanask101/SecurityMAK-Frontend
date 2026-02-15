import { create } from "zustand";
import { documentApi } from "@/api/document.api";
import type { CaseDocument } from "@/types/document";
import { getErrorMessage } from "@/lib/getErrorMessage";

interface DocumentState {
  documents: CaseDocument[];
  loading: boolean;
  error: string | null;

  fetchDocuments: (caseId: number) => Promise<void>;
  uploadDocument: (
    caseId: number,
    file: File,
    sensitivity: string
  ) => Promise<void>;
  deleteDocument: (
    caseId: number,
    documentId: number
  ) => Promise<void>;
}

export const useDocumentStore = create<DocumentState>((set) => ({
  documents: [],
  loading: false,
  error: null,

  fetchDocuments: async (caseId) => {
    set({ loading: true, error: null });
    try {
      const data = await documentApi.list(caseId);
      set({ documents: data, loading: false });
    } catch (err) {
      set({ error: getErrorMessage(err), loading: false });
    }
  },

  uploadDocument: async (caseId, file, sensitivity) => {
    set({ loading: true, error: null });
    try {
      await documentApi.upload(caseId, file, sensitivity);
      const updated = await documentApi.list(caseId);
      set({ documents: updated, loading: false });
    } catch (err) {
      set({ error: getErrorMessage(err), loading: false });
    }
  },

  deleteDocument: async (caseId, documentId) => {
    set({ loading: true, error: null });
    try {
      await documentApi.delete(caseId, documentId);
      const updated = await documentApi.list(caseId);
      set({ documents: updated, loading: false });
    } catch (err) {
      set({ error: getErrorMessage(err), loading: false });
    }
  },
}));
