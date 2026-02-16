/* ========================================
   Sensitivity Enum (frontend mirror)
======================================== */
export type SensitivityLevel =
  | "LOW"
  | "MEDIUM"
  | "HIGH"
  | "CRITICAL";

/* ========================================
   Single Document Version
======================================== */
export interface CaseDocument {
  id: number;
  fileName: string;
  fileType: string;
  fileSize: number;
  sensitivityLevel: SensitivityLevel;
  uploadedBy: string;
  uploadedAt: string;
  documentGroupId: string;
  version: number;
  active: boolean;
  fileHash: string;
}

/* ========================================
   Document Group (Version History)
======================================== */
export interface CaseDocumentGroup {
  documentGroupId: string;
  versions: CaseDocument[];
}
