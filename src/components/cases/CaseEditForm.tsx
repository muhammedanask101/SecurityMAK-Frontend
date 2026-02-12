// components/cases/CaseEditForm.tsx

import { useState } from "react";
import { useCaseStore } from "@/store/case.store";
import type { CaseResponse } from "@/types/case";

interface Props {
  caseData: CaseResponse;
  isOwner: boolean;
}

export default function CaseEditForm({
  caseData,
  isOwner,
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
  };

  return (
    <div className="bg-white border rounded-xl p-6 space-y-4">
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

      <button
        onClick={handleSave}
        disabled={loading}
        className="px-4 py-2 bg-gray-900 text-white text-sm rounded-md hover:bg-gray-800 disabled:opacity-50"
      >
        {loading ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
}
