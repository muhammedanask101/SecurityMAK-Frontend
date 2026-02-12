// components/cases/StatusTransitionControl.tsx

import type { CaseStatus } from "@/types/case";

interface Props {
  currentStatus: CaseStatus;
  transitions: CaseStatus[];
  loading?: boolean;
  onChange: (status: CaseStatus) => void;
}

export default function StatusTransitionControl({
  transitions,
  loading,
  onChange,
}: Props) {
  if (transitions.length === 0) {
    return (
      <div className="text-xs text-gray-400">
        No further transitions available.
      </div>
    );
  }

  return (
    <div className="flex gap-2 flex-wrap">
      {transitions.map((status) => (
        <button
          key={status}
          disabled={loading}
          onClick={() => onChange(status)}
          className="px-3 py-1 text-sm border rounded-md hover:bg-gray-50 disabled:opacity-50"
        >
          Move to {status}
        </button>
      ))}
    </div>
  );
}
