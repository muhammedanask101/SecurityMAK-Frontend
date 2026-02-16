import { useState, useRef, useEffect } from "react";
import api from "@/api/axios";
import axios from "axios";
import { useAuthStore } from "@/store/auth.store";
import type { SensitivityLevel } from "@/types/document";
import {
  MAX_DOCUMENT_SIZE_BYTES,
  MAX_DOCUMENT_SIZE_MB,
  ALLOWED_DOCUMENT_TYPES,
} from "@/document.constants";

interface Props {
  caseId: number;
  onClose: () => void;
  onUploaded: () => void;
}

const levels: SensitivityLevel[] = [
  "LOW",
  "MEDIUM",
  "HIGH",
  "CRITICAL",
];

export default function DocumentUploadModal({
  caseId,
  onClose,
  onUploaded,
}: Props) {
  const [files, setFiles] = useState<File[]>([]);
  const [sensitivity, setSensitivity] =
    useState<SensitivityLevel>("LOW");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { user } = useAuthStore();

  /* ===============================
     CLEARANCE-BASED SENSITIVITY
  =============================== */
  const allowedLevels: SensitivityLevel[] =
    user?.role === "ADMIN"
      ? levels
      : levels.slice(
          0,
          levels.indexOf(
            (user?.clearanceLevel as SensitivityLevel) ??
              "LOW"
          ) + 1
        );

  useEffect(() => {
    if (!allowedLevels.includes(sensitivity)) {
      setSensitivity(allowedLevels[0]);
    }
  }, [allowedLevels, sensitivity]);

  /* ===============================
     FILE HANDLING
  =============================== */
  function handleFiles(selected: FileList | null) {
    if (!selected) return;

    const validFiles: File[] = [];

    Array.from(selected).forEach((file) => {
      // Size validation
      if (file.size > MAX_DOCUMENT_SIZE_BYTES) {
        setError(
          `${file.name} exceeds ${MAX_DOCUMENT_SIZE_MB}MB limit`
        );
        return;
      }

      // Type validation
      if (!ALLOWED_DOCUMENT_TYPES.includes(file.type)) {
        setError(
          `${file.name} is not a supported file type`
        );
        return;
      }

      validFiles.push(file);
    });

    setFiles((prev) => [...prev, ...validFiles]);
  }

  function handleDrop(
    e: React.DragEvent<HTMLDivElement>
  ) {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  }

  function removeFile(index: number) {
    setFiles((prev) =>
      prev.filter((_, i) => i !== index)
    );
  }

  /* ===============================
     UPLOAD
  =============================== */
  async function handleUpload() {
    if (files.length === 0) return;

    try {
      setUploading(true);
      setError(null);

      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append(
          "sensitivityLevel",
          sensitivity
        );

        await api.post(
          `/api/cases/${caseId}/documents`,
          formData,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },
          }
        );
      }

      onUploaded();
      onClose();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Upload failed"
        );
      } else {
        setError(
          "Unexpected error occurred"
        );
      }
    } finally {
      setUploading(false);
    }
  }

  /* ===============================
     UI
  =============================== */
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden">
        {/* HEADER */}
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-sm font-semibold text-slate-900">
            Upload Documents
          </h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-900"
          >
            ✕
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-6">
          {/* Drag & Drop */}
          <div
            onDragOver={(e) =>
              e.preventDefault()
            }
            onDrop={handleDrop}
            onClick={() =>
              fileInputRef.current?.click()
            }
            className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center cursor-pointer hover:border-slate-400 transition"
          >
            <p className="text-sm text-slate-600">
              Drag & drop files here or click to
              browse
            </p>
            <p className="text-xs text-slate-400 mt-2">
              Maximum file size:{" "}
              {MAX_DOCUMENT_SIZE_MB}MB
            </p>
            <input
              type="file"
              multiple
              hidden
              ref={fileInputRef}
              onChange={(e) =>
                handleFiles(
                  e.target.files
                )
              }
            />
          </div>

          {/* Selected Files */}
          {files.length > 0 && (
            <div className="space-y-3">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center bg-slate-50 px-4 py-2 rounded-lg text-sm"
                >
                  <span className="truncate max-w-[200px]">
                    {file.name}
                  </span>
                  <button
                    onClick={() =>
                      removeFile(index)
                    }
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Sensitivity Selector */}
          <div>
            <label className="block text-xs text-slate-500 mb-2">
              Sensitivity Level
            </label>
            <select
              value={sensitivity}
              onChange={(e) =>
                setSensitivity(
                  e.target
                    .value as SensitivityLevel
                )
              }
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
            >
              {allowedLevels.map(
                (level) => (
                  <option
                    key={level}
                    value={level}
                  >
                    {level}
                  </option>
                )
              )}
            </select>
          </div>

          {/* Error */}
          {error && (
            <div className="text-sm text-red-600">
              {error}
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="px-6 py-4 border-t flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900"
          >
            Cancel
          </button>

          <button
            onClick={handleUpload}
            disabled={
              uploading ||
              files.length === 0
            }
            className="px-5 py-2 text-sm bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition disabled:opacity-50"
          >
            {uploading
              ? "Uploading..."
              : "Upload"}
          </button>
        </div>
      </div>
    </div>
  );
}
