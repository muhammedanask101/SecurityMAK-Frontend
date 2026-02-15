import api from "./axios";
import type { CaseDocument } from "@/types/document";

export const documentApi = {
  list: async (caseId: number) => {
    const res = await api.get<CaseDocument[]>(
      `/api/cases/${caseId}/documents`
    );
    return res.data;
  },

  upload: async (
    caseId: number,
    file: File,
    sensitivityLevel: string
  ) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("sensitivityLevel", sensitivityLevel);

    const res = await api.post(
      `/api/cases/${caseId}/documents`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    return res.data;
  },

  delete: async (caseId: number, documentId: number) => {
    await api.delete(
      `/api/cases/${caseId}/documents/${documentId}`
    );
  },
};
