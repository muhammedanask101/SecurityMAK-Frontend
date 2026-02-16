import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";
import { documentApi } from "@/api/document.api";
import type { SensitivityLevel } from "@/types/document";

interface Props {
  id: number;
  caseId: number;
  fileName: string;
  fileType: string;
  fileSize: number;
  sensitivityLevel: SensitivityLevel;
  uploadedBy: string;
  uploadedAt: string;
  version: number;
  fileHash?: string;
  isLatest?: boolean;
  onDelete?: (id: number) => void;
}


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

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [previewLoading, setPreviewLoading] = useState(false);
const [previewError, setPreviewError] = useState<string | null>(null);

  
useEffect(() => {
  return () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
  };
}, [previewUrl]);

async function loadPreview() {
  try {
    setPreviewLoading(true);
    setPreviewError(null);

    const blob = await documentApi.download(caseId, id);
    const url = window.URL.createObjectURL(blob);
    setPreviewUrl(url);
  } catch {
  setPreviewError("Failed to load preview.");
}
   finally {
    setPreviewLoading(false);
  }
}

  function formatSize(bytes: number) {
    if (!bytes) return "—";
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(2)} MB`;
  }

 async function handleDownload() {
  try {
    const blob = await documentApi.download(caseId, id);

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  } catch (err) {
    console.error("Download failed", err);
  }
}

  return (
    <>
      <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:bg-slate-50 transition">

        {/* LEFT SIDE */}
        <div className="space-y-2 min-w-0">

          <div className="flex items-center gap-3 flex-wrap min-w-0">

  <span className="text-lg shrink-0">
    {getFileIcon(fileType)}
  </span>

  <span className="text-sm font-medium text-slate-900 truncate max-w-[240px]">
    {fileName}
  </span>

  {!isLatest && (
    <span className="text-xs bg-slate-200 text-slate-700 px-2 py-1 rounded-md">
      Superseded
    </span>
  )}

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
            disabled={previewLoading}
            onClick={() => {
              setPreviewOpen(true);
              loadPreview();
            }}
            className="text-slate-600 hover:text-slate-900 transition disabled:opacity-50"
          >
            {previewLoading ? "Loading..." : "Preview"}
          </button>

          <button
            onClick={handleDownload}
            className="text-slate-600 hover:text-slate-900 transition"
          >
            Download
          </button>

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
                onClick={() => {
  if (previewUrl) {
    URL.revokeObjectURL(previewUrl);
  }
  setPreviewUrl(null);
  setPreviewOpen(false);
}}
                className="text-slate-500 hover:text-slate-900"
              >
                ✕
              </button>
            </div>

            <div className="h-[70vh] flex items-center justify-center">
              {previewLoading && (
  <div className="text-sm text-slate-500 animate-pulse">
    Loading preview...
  </div>
)}

{previewError && (
  <div className="text-sm text-red-600">
    {previewError}
  </div>
)}

{!previewLoading && !previewError && fileType.includes("pdf") && (
  <iframe
    src={previewUrl ?? ""}
    className="w-full h-full"
  />
)}

{!previewLoading && !previewError && fileType.includes("image") && (
  <img
    src={previewUrl ?? ""}
    className="max-h-full mx-auto"
  />
)}

{!previewLoading &&
  !previewError &&
  !fileType.includes("pdf") &&
  !fileType.includes("image") && (
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
