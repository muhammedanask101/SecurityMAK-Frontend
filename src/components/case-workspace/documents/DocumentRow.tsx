import { useState } from "react";
import { useAuthStore } from "@/store/auth.store";

interface Props {
  id: number;
  caseId: number;
  fileName: string;
  fileType: string;
  fileSize: number;
  sensitivityLevel: string;
  uploadedBy: string;
  uploadedAt: string;
  version: number;
  fileHash?: string;
  isLatest?: boolean;
  onDelete?: (id: number) => void;
}

const sensitivityStyles: Record<string, string> = {
  LOW: "bg-green-100 text-green-700",
  MEDIUM: "bg-yellow-100 text-yellow-700",
  HIGH: "bg-orange-100 text-orange-700",
  CRITICAL: "bg-red-100 text-red-700",
};

function getFileIcon(type: string) {
  if (type.includes("pdf")) return "📕";
  if (type.includes("word") || type.includes("doc")) return "📘";
  if (type.includes("excel") || type.includes("sheet")) return "📗";
  if (type.includes("image")) return "🖼";
  return "📄";
}

export default function DocumentRow({
  id,
  caseId,
  fileName,
  fileType,
  fileSize,
  sensitivityLevel,
  uploadedBy,
  uploadedAt,
  version,
  fileHash,
  isLatest = true,
  onDelete,
}: Props) {
  const { user } = useAuthStore();
  const isAdmin = user?.role === "ADMIN";

  const [previewOpen, setPreviewOpen] = useState(false);

  function formatSize(bytes: number) {
    if (!bytes) return "—";
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(2)} MB`;
  }

  return (
    <>
      <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:bg-slate-50 transition">

        {/* LEFT SIDE */}
        <div className="space-y-2 min-w-0">

          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-lg">
              {getFileIcon(fileType)}
            </span>

            <span className="text-sm font-medium text-slate-900 truncate max-w-[250px]">
              {fileName}
            </span>

            {!isLatest && (
              <span className="text-xs bg-slate-200 text-slate-700 px-2 py-1 rounded-md">
                Superseded
              </span>
            )}

            <span
              className={`px-2 py-1 text-xs rounded-md font-medium ${
                sensitivityStyles[sensitivityLevel]
              }`}
            >
              {sensitivityLevel}
            </span>

            <span className="text-xs text-slate-500">
              v{version}
            </span>
          </div>

          <div className="text-xs text-slate-600">
            {fileType} • {formatSize(fileSize)}
          </div>

          <div className="text-xs text-slate-500">
            Uploaded by {uploadedBy} •{" "}
            {new Date(uploadedAt).toLocaleString()}
          </div>

          {fileHash && (
            <div className="text-xs text-slate-400 font-mono break-all">
              SHA-256: {fileHash.slice(0, 20)}...
            </div>
          )}
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-4 text-sm">

          <button
            onClick={() => setPreviewOpen(true)}
            className="text-slate-600 hover:text-slate-900 transition"
          >
            Preview
          </button>

          <a
            href={`/api/cases/${caseId}/documents/${id}/download`}
            className="text-slate-600 hover:text-slate-900 transition"
          >
            Download
          </a>

          {isAdmin && onDelete && (
            <button
              onClick={() => onDelete(id)}
              className="text-red-600 hover:text-red-800 transition"
            >
              Delete
            </button>
          )}
        </div>
      </div>

      {/* =========================
         PREVIEW MODAL
      ========================== */}
      {previewOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-lg overflow-hidden">

            <div className="flex justify-between items-center px-6 py-4 border-b">
              <h3 className="text-sm font-semibold truncate">
                {fileName}
              </h3>
              <button
                onClick={() => setPreviewOpen(false)}
                className="text-slate-500 hover:text-slate-900"
              >
                ✕
              </button>
            </div>

            <div className="h-[70vh]">
              {fileType.includes("pdf") ? (
                <iframe
                  src={`/api/cases/${caseId}/documents/${id}/download`}
                  className="w-full h-full"
                />
              ) : fileType.includes("image") ? (
                <img
                  src={`/api/cases/${caseId}/documents/${id}/download`}
                  className="max-h-full mx-auto"
                />
              ) : (
                <div className="p-6 text-sm text-slate-500">
                  Preview not supported for this file type.
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </>
  );
}
