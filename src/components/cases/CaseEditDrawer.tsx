import { useEffect, useState } from "react";
import { useCaseStore } from "@/store/case.store";
import type { CaseResponse } from "@/types/case";

interface Props {
  caseData: CaseResponse;
  onClose: () => void;
}

export default function CaseEditDrawer({
  caseData,
  onClose,
}: Props) {
  const { updateCase } = useCaseStore();

  const [title, setTitle] = useState(caseData.title);
  const [description, setDescription] = useState(
    caseData.description ?? ""
  );
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
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

  const hasChanges =
    title !== caseData.title ||
    description !== (caseData.description ?? "");

  return (
    <div
      className="
        w-full
        max-w-xl
        bg-white
        h-full
        shadow-2xl
        border-l
        border-slate-200
        flex
        flex-col
        animate-slide-in
      "
    >
      {/* ========================================
         HEADER
      ======================================== */}
      <div className="px-8 py-6 border-b bg-white sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Edit Case
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Modify case details and save changes
            </p>
          </div>

          <button
            onClick={onClose}
            className="
              w-8 h-8
              flex items-center justify-center
              rounded-md
              text-slate-400
              hover:bg-slate-100
              hover:text-slate-700
              transition
            "
          >
            ✕
          </button>
        </div>
      </div>

      {/* ========================================
         FORM CONTENT
      ======================================== */}
      <div className="flex-1 overflow-y-auto px-8 py-8 space-y-8">

        {/* Title Field */}
        <div className="space-y-2">
          <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide">
            Title
          </label>
          <input
            autoFocus
            className="
              w-full
              border border-slate-300
              rounded-xl
              px-4 py-3
              text-sm
              bg-white
              shadow-sm
              focus:outline-none
              focus:ring-2
              focus:ring-slate-900
              focus:border-slate-900
              transition
            "
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Description Field */}
        <div className="space-y-2">
          <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide">
            Description
          </label>
          <textarea
            rows={8}
            className="
              w-full
              border border-slate-300
              rounded-xl
              px-4 py-3
              text-sm
              bg-white
              shadow-sm
              focus:outline-none
              focus:ring-2
              focus:ring-slate-900
              focus:border-slate-900
              transition
              resize-none
            "
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
          />
        </div>
      </div>

      {/* ========================================
         FOOTER
      ======================================== */}
      <div className="px-8 py-6 border-t bg-white sticky bottom-0">
        <div className="flex justify-between items-center">
          <span className="text-xs text-slate-400">
            {hasChanges
              ? "Unsaved changes"
              : "No changes made"}
          </span>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="
                px-5 py-2.5
                text-sm
                font-medium
                text-slate-600
                hover:text-slate-900
                transition
              "
            >
              Cancel
            </button>

            <button
              onClick={handleSave}
              disabled={!hasChanges || saving}
              className="
                px-6 py-2.5
                text-sm
                font-medium
                rounded-xl
                bg-slate-900
                text-white
                shadow-sm
                hover:bg-slate-800
                transition
                disabled:opacity-50
                disabled:cursor-not-allowed
              "
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
