import { useState } from "react";
import { useAuthStore } from "@/store/auth.store";

interface DocumentVersion {
  id: number;
  fileName: string;
  fileType: string;
  fileSize: number;
  sensitivityLevel: string;
  uploadedBy: string;
  uploadedAt: string;
  version: number;
}

interface Props {
  groupId: string;
  documents: DocumentVersion[];
  caseId: number;
  onDelete: (id: number) => void;
}

const sensitivityStyles: Record<string, string> = {
  LOW: "bg-green-100 text-green-700",
  MEDIUM: "bg-yellow-100 text-yellow-700",
  HIGH: "bg-orange-100 text-orange-700",
  CRITICAL: "bg-red-100 text-red-700",
};

export default function DocumentGroup({
  documents,
  caseId,
  onDelete,
}: Props) {
  const { user } = useAuthStore();
  const isAdmin = user?.role === "ADMIN";

  const [expanded, setExpanded] = useState(false);

  // Sort versions descending (latest first)
  const sorted = [...documents].sort(
    (a, b) => b.version - a.version
  );

  const latest = sorted[0];

  function formatSize(bytes: number) {
    if (!bytes) return "—";
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(2)} MB`;
  }

  return (
    <div className="bg-white border rounded-2xl shadow-sm">
      {/* GROUP HEADER */}
      <div
        onClick={() => setExpanded(!expanded)}
        className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 cursor-pointer hover:bg-slate-50 transition"
      >
        <div className="space-y-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h3 className="text-sm font-semibold text-slate-900">
              {latest.fileName}
            </h3>

            <span
              className={`px-2 py-1 text-xs rounded-md font-medium ${
                sensitivityStyles[
                  latest.sensitivityLevel
                ]
              }`}
            >
              {latest.sensitivityLevel}
            </span>

            <span className="text-xs text-slate-500">
              Latest v{latest.version}
            </span>
          </div>

          <div className="text-xs text-slate-500">
            Uploaded by {latest.uploadedBy} •{" "}
            {new Date(
              latest.uploadedAt
            ).toLocaleString()}
          </div>
        </div>

        <div className="text-xs text-slate-500">
          {sorted.length} version
          {sorted.length > 1 ? "s" : ""}
        </div>
      </div>

      {/* VERSION LIST */}
      {expanded && (
        <div className="border-t divide-y">
          {sorted.map((doc) => (
            <div
              key={doc.id}
              className="p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
              <div className="space-y-1 text-sm">
                <div className="font-medium text-slate-900">
                  Version {doc.version}
                </div>

                <div className="text-slate-600 text-xs">
                  {doc.fileType} •{" "}
                  {formatSize(doc.fileSize)}
                </div>

                <div className="text-slate-500 text-xs">
                  {doc.uploadedBy} •{" "}
                  {new Date(
                    doc.uploadedAt
                  ).toLocaleString()}
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm">
                <a
                  href={`/api/cases/${caseId}/documents/${doc.id}/download`}
                  className="text-slate-600 hover:text-slate-900"
                >
                  Download
                </a>

                {isAdmin && (
                  <button
                    onClick={() => onDelete(doc.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
