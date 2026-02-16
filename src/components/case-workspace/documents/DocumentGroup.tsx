import { useState, useRef } from "react";
import type { CaseDocument, SensitivityLevel } from "@/types/document";
import DocumentRow from "./DocumentRow";
import { useAuthStore } from "@/store/auth.store";
import { useDocumentStore } from "@/store/document.store";
import { useCaseStore } from "@/store/case.store";

const sensitivityStyles: Record<SensitivityLevel, string> = {
  LOW: "bg-green-100 text-green-700",
  MEDIUM: "bg-yellow-100 text-yellow-700",
  HIGH: "bg-orange-100 text-orange-700",
  CRITICAL: "bg-red-100 text-red-700",
};

interface Props {
  groupId: string;
  documents: CaseDocument[];
  caseId: number;
  onDelete: (id: number) => void;
  onUploadVersion: (
    groupId: string,
    file: File
  ) => Promise<void>;
}

export default function DocumentGroup({
  groupId,
  documents,
  caseId,
  onDelete,
  onUploadVersion,
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { user } = useAuthStore();
  const isAdmin = user?.role === "ADMIN";
      const { selectedCase } = useCaseStore();
      const isOwner = user?.email === selectedCase?.ownerEmail;
const { updateGroupSensitivity } = useDocumentStore();

  const sorted = [...documents].sort(
    (a, b) => b.version - a.version
  );

  if (!sorted.length) return null;

  const latest = sorted[0];

  // ✅ FIX: define properly with type safety
  const latestSensitivity: SensitivityLevel =
    latest.sensitivityLevel as SensitivityLevel;

  return (
    <div className="bg-white border rounded-2xl shadow-sm">
      {/* GROUP HEADER */}
      <div
        onClick={() => setExpanded(!expanded)}
        className="p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 cursor-pointer hover:bg-slate-50 transition"
      >
        {/* LEFT */}
        <div className="space-y-2 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h3 className="text-sm font-semibold text-slate-900 truncate max-w-[300px]">
              {latest.fileName}
            </h3>

            {/* Sensitivity Badge */}
            <span
              className={`px-2.5 py-1 text-xs rounded-full font-medium ${
                sensitivityStyles[latestSensitivity]
              }`}
            >
              {latestSensitivity}
            </span>

            <span className="text-xs text-slate-500">
              Latest v{latest.version}
            </span>
          </div>

          <div className="text-xs text-slate-500">
            {sorted.length} version
            {sorted.length > 1 ? "s" : ""}
          </div>
        </div>

        {/* RIGHT */}
        <div
          className="flex items-center gap-3"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Edit Sensitivity (ADMIN ONLY) */}
          {isAdmin && (
  <select
    value={latestSensitivity}
    onChange={async (e) => {
      const newLevel =
        e.target.value as SensitivityLevel;

      await updateGroupSensitivity(
        caseId,
        groupId,
        newLevel
      );
    }}
    className="text-xs border border-slate-300 px-3 py-1 rounded-md bg-white"
  >
    <option value="LOW">LOW</option>
    <option value="MEDIUM">MEDIUM</option>
    <option value="HIGH">HIGH</option>
    <option value="CRITICAL">CRITICAL</option>
  </select>
)}
  { (isAdmin || isOwner) &&
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-xs bg-slate-100 hover:bg-slate-200 px-3 py-1 rounded-md transition"
          >
            Upload New Version
          </button> }

          <input
            type="file"
            hidden
            ref={fileInputRef}
            onChange={async (e) => {
              if (!e.target.files) return;

              const file = e.target.files[0];

              await onUploadVersion(groupId, file);

              e.target.value = "";
            }}
          />
        </div>
      </div>

      {/* VERSION LIST */}
      {expanded && (
        <div className="border-t divide-y">
          {sorted.map((doc, index) => (
            <DocumentRow
              key={doc.id}
              {...doc}
              caseId={caseId}
              isLatest={index === 0}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
