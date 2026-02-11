import { useState } from "react";
import { updateCaseStatus } from "../api/case.api";
import { getAllowedTransitions } from "../utils/caseTransitions";
import { useAuthStore } from "../store/auth.store";

interface Props {
  caseId: number;
  currentStatus: string;
  onStatusUpdated: (newStatus: string) => void;
}

export default function UpdateStatusSection({
  caseId,
  currentStatus,
  onStatusUpdated,
}: Props) {
  const [loading, setLoading] = useState(false);
  const user = useAuthStore((s) => s.user);

  const allowed = getAllowedTransitions(currentStatus);

  if (!user?.roles.includes("ADMIN")) {
    return null; // only admins can transition (for now)
  }

  if (allowed.length === 0) {
    return null;
  }

  async function handleChange(newStatus: string) {
    try {
      setLoading(true);
      await updateCaseStatus(caseId, newStatus);
      onStatusUpdated(newStatus);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-6">
      <h3 className="text-sm font-medium mb-2">Update Status</h3>

      <div className="flex gap-2">
        {allowed.map((status) => (
          <button
            key={status}
            disabled={loading}
            onClick={() => handleChange(status)}
            className="bg-slate-900 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
          >
            {status}
          </button>
        ))}
      </div>
    </div>
  );
}
