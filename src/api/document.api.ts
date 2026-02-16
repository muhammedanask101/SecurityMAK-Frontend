import api from "./axios";
import type {
  CaseDocumentGroup,
  SensitivityLevel,
} from "@/types/document";

export const documentApi = {
  /* ===============================
     LIST DOCUMENT GROUPS
     =============================== */
  list: async (
    caseId: number
  ): Promise<CaseDocumentGroup[]> => {
    const res = await api.get<CaseDocumentGroup[]>(
      `/api/cases/${caseId}/documents`
    );
    return res.data;
  },

  /* ===============================
     UPLOAD (NEW OR NEW VERSION)
     =============================== */
  upload: async (
    caseId: number,
    file: File,
    sensitivityLevel: SensitivityLevel,
    documentGroupId?: string // optional for versioning
  ) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("sensitivityLevel", sensitivityLevel);

    if (documentGroupId) {
      formData.append("documentGroupId", documentGroupId);
    }

    await api.post(
      `/api/cases/${caseId}/documents`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  },

    /* ===============================
     DOWNLOAD
  =============================== */
  download: async (
    caseId: number,
    documentId: number
  ): Promise<Blob> => {
    const res = await api.get(
      `/api/cases/${caseId}/documents/${documentId}/download`,
      { responseType: "blob" }
    );

    return res.data;
  },

  /* ===============================
     DELETE DOCUMENT (ADMIN)
     =============================== */
  delete: async (
    caseId: number,
    documentId: number
  ) => {
    await api.delete(
      `/api/cases/${caseId}/documents/${documentId}`
    );
  },

  updateGroupSensitivity: async (
  caseId: number,
  groupId: string,
  sensitivity: SensitivityLevel
) => {
  await api.patch(
    `/api/cases/${caseId}/documents/${groupId}/sensitivity`,
    null,
    {
      params: { sensitivityLevel: sensitivity },
    }
  );
},
};
