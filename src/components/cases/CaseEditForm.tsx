import { useState } from "react";
import { useCaseStore } from "@/store/case.store";
import type { CaseResponse } from "@/types/case";

interface Props {
  caseData: CaseResponse;
  isOwner: boolean;
  onCancel: () => void;
  onSaved: () => void;
}

export default function CaseEditForm({
  caseData,
  isOwner,
  onCancel,
  onSaved,
}: Props) {
  const { updateCase, loading } = useCaseStore();

  const [title, setTitle] = useState(caseData.title);
  const [description, setDescription] = useState(
    caseData.description
  );

  const editableStatuses = ["OPEN", "IN_PROGRESS"];
  const canEdit =
    isOwner &&
    editableStatuses.includes(caseData.status);

  if (!canEdit) return null;

  const handleSave = async () => {
    await updateCase(caseData.id, {
      title,
      description,
    });

    onSaved();
  };

  return (
    <div className="bg-white border rounded-2xl p-6 space-y-4 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-700">
        Edit Case
      </h3>

      <input
        className="w-full border rounded-md px-3 py-2 text-sm"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        className="w-full border rounded-md px-3 py-2 text-sm"
        rows={4}
        value={description}
        onChange={(e) =>
          setDescription(e.target.value)
        }
      />

      <div className="flex gap-3">
        <button
          onClick={handleSave}
          disabled={loading}
          className="px-4 py-2 bg-gray-900 text-white text-sm rounded-md hover:bg-gray-800 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>

        <button
          onClick={onCancel}
          className="px-4 py-2 border text-sm rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}