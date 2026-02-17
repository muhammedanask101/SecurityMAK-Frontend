import { useEffect, useMemo, useState } from "react";
import { useDocumentStore } from "@/store/document.store";
import { useAuthStore } from "@/store/auth.store";
import DocumentGroup from "../documents/DocumentGroup";
import type { SensitivityLevel } from "@/types/document";
import { useCaseStore } from "@/store/case.store";

interface Props {
  caseId: number;
}

export default function DocumentsTab({ caseId }: Props) {
  const {
    documents,
    fetchDocuments,
    deleteDocument,
    uploadDocument,
    loading,
    error,
  } = useDocumentStore();

  const { user } = useAuthStore();
    const { selectedCase } = useCaseStore();
    const isAdmin = user?.role === "ADMIN";
    const isOwner = user?.email === selectedCase?.ownerEmail;

  /* =========================================
     SENSITIVITY LEVELS
  ========================================= */
  const levels: SensitivityLevel[] = [
    "LOW",
    "MEDIUM",
    "HIGH",
    "CRITICAL",
  ];

  

  const allowedLevels = useMemo<SensitivityLevel[]>(() => {
    if (!user) return ["LOW"];

    if (user.role === "ADMIN") return levels;

    const index = levels.indexOf(
      user.clearanceLevel as SensitivityLevel
    );

    return levels.slice(0, index + 1);
  }, [user]);

  /* =========================================
     STATE
  ========================================= */
  const [selectedSensitivity, setSelectedSensitivity] =
    useState<SensitivityLevel>("LOW");

  const [uploading, setUploading] = useState(false);

  /* Ensure selected level always valid */
  useEffect(() => {
    if (!allowedLevels.includes(selectedSensitivity)) {
      setSelectedSensitivity(allowedLevels[0]);
    }
  }, [allowedLevels]);

  /* Fetch documents */
  useEffect(() => {
    fetchDocuments(caseId);
  }, [caseId, fetchDocuments]);

  /* =========================================
     UPLOAD HANDLER
  ========================================= */
  async function handleUpload(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    if (!e.target.files) return;

    const file = e.target.files[0];

    try {
      setUploading(true);

      await uploadDocument(
        caseId,
        file,
        selectedSensitivity
      );

      e.target.value = "";
    } finally {
      setUploading(false);
    }
  }

  /* =========================================
     UI
  ========================================= */
  return (
    <div className="space-y-8">

      {/* =====================================
         HEADER
      ====================================== */}
      <div className="bg-white border rounded-2xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

          {/* Title */}
          <div className="space-y-1">
            <h2 className="text-lg font-semibold text-slate-900">
              Documents
            </h2>
            <p className="text-xs text-slate-500">
              Version-controlled case documents with clearance-based visibility.
            </p>
          </div>
  { (isAdmin || isOwner) &&
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <select
              value={selectedSensitivity}
              onChange={(e) =>
                setSelectedSensitivity(
                  e.target.value as SensitivityLevel
                )
              }
              className="border border-slate-300 bg-white rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
            >
              {allowedLevels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select> 

          
            <label className="inline-flex items-center justify-center bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm cursor-pointer hover:bg-slate-800 transition disabled:opacity-50 whitespace-nowrap">
              {uploading ? "Uploading..." : "Upload Document"}
              <input
                type="file"
                hidden
                onChange={handleUpload}
              />
            </label>


          </div>
            }
        </div>
      </div>

      {/* =====================================
         ERROR
      ====================================== */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {/* =====================================
         LOADING
      ====================================== */}
     {loading && (
  <div className="space-y-6 animate-pulse">
    {Array.from({ length: 2 }).map((_, groupIndex) => (
      <div
        key={groupIndex}
        className="bg-white border rounded-2xl shadow-sm overflow-hidden"
      >
        {/* Group Header */}
        <div className="px-6 py-4 border-b bg-slate-50 flex justify-between items-center">
          <div className="h-4 w-40 bg-slate-200 rounded" />
          <div className="h-4 w-20 bg-slate-200 rounded" />
        </div>

        {/* Version Rows */}
        <div className="divide-y">
          {Array.from({ length: 2 }).map((_, versionIndex) => (
            <div
              key={versionIndex}
              className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
              {/* Left Info */}
              <div className="space-y-3 flex-1">
                <div className="h-4 w-56 bg-slate-200 rounded" />
                <div className="h-3 w-40 bg-slate-200 rounded" />
                <div className="h-3 w-64 bg-slate-200 rounded" />
              </div>

              {/* Right Actions */}
              <div className="flex gap-4">
                <div className="h-4 w-16 bg-slate-200 rounded" />
                <div className="h-4 w-12 bg-slate-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
)}

      {/* =====================================
         EMPTY STATE
      ====================================== */}
      {!loading && documents.length === 0 && (
        <div className="bg-white border rounded-2xl p-10 text-center text-sm text-slate-500 shadow-sm">
          No documents uploaded for this case.
        </div>
      )}

      {/* =====================================
         DOCUMENT GROUPS
      ====================================== */}
      {!loading && documents.length > 0 && (
      <div className="space-y-6">
        {documents.map((group) => (
          <DocumentGroup
            key={group.documentGroupId}
            groupId={group.documentGroupId}
            documents={group.versions}
            caseId={caseId}
            onDelete={(id) =>
              deleteDocument(caseId, id)
            }
            onUploadVersion={async (groupId, file) => {
              const targetGroup = documents.find(
                (g) => g.documentGroupId === groupId
              );

              const latestSensitivity =
                targetGroup?.versions?.[0]?.sensitivityLevel ??
                selectedSensitivity;

              await uploadDocument(
                caseId,
                file,
                latestSensitivity,
                groupId
              );
            }}
          />
        ))}
      </div>
      )}
    </div>
  );
}
