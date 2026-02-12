// pages/cases/CreateCasePage.tsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCaseStore } from "@/store/case.store";
import type { SensitivityLevel } from "@/types/case";

export default function CreateCasePage() {
  const navigate = useNavigate();
  const { createCase, loading, error } = useCaseStore();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [sensitivityLevel, setSensitivityLevel] =
    useState<SensitivityLevel>("LOW");

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) return;

    await createCase({
      title,
      description,
      sensitivityLevel,
    });

    navigate("/cases");
  };

  return (
    <div className="p-8 max-w-2xl space-y-6">
      <h1 className="text-xl font-semibold text-gray-800">
        Create Case
      </h1>

      {error && (
        <div className="text-sm text-red-600">{error}</div>
      )}

      <input
        className="w-full border rounded-md px-3 py-2 text-sm"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        className="w-full border rounded-md px-3 py-2 text-sm"
        rows={5}
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <select
        value={sensitivityLevel}
        onChange={(e) =>
          setSensitivityLevel(
            e.target.value as SensitivityLevel
          )
        }
        className="w-full border rounded-md px-3 py-2 text-sm"
      >
        <option value="LOW">LOW</option>
        <option value="MEDIUM">MEDIUM</option>
        <option value="HIGH">HIGH</option>
        <option value="CRITICAL">CRITICAL</option>
      </select>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="px-4 py-2 bg-gray-900 text-white text-sm rounded-md hover:bg-gray-800 disabled:opacity-50"
      >
        {loading ? "Creating..." : "Submit"}
      </button>
    </div>
  );
}
