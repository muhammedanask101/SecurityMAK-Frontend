export interface CaseDocument {
  id: number;
  fileName: string;
  fileType: string;
  fileSize: number;
  sensitivityLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  uploadedBy: string;
  uploadedAt: string;

  documentGroupId: string;
  version: number;
  active: boolean;
  fileHash: string;
}