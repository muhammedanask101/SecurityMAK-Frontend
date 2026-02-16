import { useEffect, useMemo, useState } from "react";
import { useCaseStore } from "@/store/case.store";
import { useAuthStore } from "@/store/auth.store";
import type {
  CaseResponse,
  SensitivityLevel,
  CaseStatus,
} from "@/types/case";

interface Props {
  caseData: CaseResponse;
  onClose: () => void;
}

const levels: SensitivityLevel[] = [
  "LOW",
  "MEDIUM",
  "HIGH",
  "CRITICAL",
];

const statusTransitions: Record<CaseStatus, CaseStatus[]> = {
  OPEN: ["IN_PROGRESS"],
  IN_PROGRESS: ["REVIEW"],
  REVIEW: ["CLOSED", "IN_PROGRESS"], // includes rollback
  CLOSED: ["ARCHIVED"],
  ARCHIVED: [],
};

export default function CaseEditDrawer({
  caseData,
  onClose,
}: Props) {
  const {
    updateCase,
    updateCaseStatus,
    updateCaseSensitivity,
  } = useCaseStore();

  const { user } = useAuthStore();
  const isAdmin = user?.role === "ADMIN";

  const [title, setTitle] = useState(caseData.title);
  const [description, setDescription] = useState(
    caseData.description ?? ""
  );
  const [selectedSensitivity, setSelectedSensitivity] =
    useState<SensitivityLevel>(caseData.sensitivityLevel);

  const [saving, setSaving] = useState(false);
  const [transitioning, setTransitioning] = useState(false);

  const availableTransitions = useMemo(() => {
    return statusTransitions[caseData.status];
  }, [caseData.status]);

  /* ESC Close */
  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }

    window.addEventListener("keydown", handleEsc);
    return () =>
      window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  async function handleSave() {
    try {
      setSaving(true);
      await updateCase(caseData.id, {
        title,
        description,
      });
      onClose();
    } finally {
      setSaving(false);
    }
  }

  async function handleSensitivityChange(
    level: SensitivityLevel
  ) {
    setSelectedSensitivity(level);
    await updateCaseSensitivity(caseData.id, level);
  }

  async function handleTransition(status: CaseStatus) {
    try {
      setTransitioning(true);
      await updateCaseStatus(caseData.id, status);
    } finally {
      setTransitioning(false);
    }
  }

  const hasChanges =
    title !== caseData.title ||
    description !== (caseData.description ?? "");

  return (
    <div className="w-full sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl bg-white h-full shadow-2xl border-l border-slate-200 flex flex-col">

      {/* ================= HEADER ================= */}
      <div className="px-6 sm:px-8 py-6 border-b bg-white sticky top-0 z-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-slate-900">
              Case Governance Panel
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Manage metadata, sensitivity, and lifecycle
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
          >
            ✕
          </button>
        </div>
      </div>

      {/* ================= BODY ================= */}
      <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-8 space-y-12">

        {/* ===== Basic Information ===== */}
        <div className="space-y-8">

          <div className="space-y-2">
            <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide">
              Title
            </label>
            <input
              className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-900 transition"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide">
              Description
            </label>
            <textarea
              rows={6}
              className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-900 resize-none transition"
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
            />
          </div>

        </div>

        {/* ===== Admin Governance ===== */}
        {isAdmin && (
          <div className="border-t pt-10 space-y-10">

            <div>
              <h3 className="text-sm font-semibold text-slate-800">
                Administrative Controls
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Clearance management and lifecycle transitions
              </p>
            </div>

            {/* ---- Sensitivity ---- */}
            <div className="space-y-3">
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide">
                Sensitivity Level
              </label>

              <select
                value={selectedSensitivity}
                onChange={(e) =>
                  handleSensitivityChange(
                    e.target.value as SensitivityLevel
                  )
                }
                className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-900 transition"
              >
                {levels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>

            {/* ---- Lifecycle ---- */}
            <div className="space-y-3">
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide">
                Lifecycle Status
              </label>

              <div className="bg-slate-50 border border-slate-200 rounded-xl px-5 py-5 space-y-4">

                <div className="text-sm text-slate-700">
                  Current Status:
                  <span className="ml-2 font-semibold text-slate-900">
                    {caseData.status}
                  </span>
                </div>

                {availableTransitions.length > 0 ? (
                  <div className="flex flex-wrap gap-3">
                    {availableTransitions.map((status) => {
                      const isRollback =
                        caseData.status === "REVIEW" &&
                        status === "IN_PROGRESS";

                      return (
                        <button
                          key={status}
                          onClick={() =>
                            handleTransition(status)
                          }
                          disabled={transitioning}
                          className={`px-4 py-2 text-xs sm:text-sm rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed ${
                            isRollback
                              ? "bg-amber-500 text-white hover:bg-amber-600"
                              : "bg-slate-900 text-white hover:bg-slate-800"
                          }`}
                        >
                          {isRollback
                            ? "Rollback to IN_PROGRESS"
                            : `Move to ${status}`}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <span className="text-xs text-slate-400">
                    Final state reached
                  </span>
                )}

              </div>
            </div>

          </div>
        )}
      </div>

      {/* ================= FOOTER ================= */}
      <div className="px-6 sm:px-8 py-6 border-t bg-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

        <span className="text-xs text-slate-400">
          {hasChanges
            ? "Unsaved changes detected"
            : "No modifications"}
        </span>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900 transition"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={!hasChanges || saving}
            className="px-6 py-2.5 text-sm font-medium rounded-xl bg-slate-900 text-white shadow-sm hover:bg-slate-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

    </div>
  );
}
