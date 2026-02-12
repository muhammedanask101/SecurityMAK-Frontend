import { useAuthStore } from "@/store/auth.store";
import { useCaseStore } from "@/store/case.store";
import { allowedTransitions } from "@/lib/allowedTransitions";
import StatusTransitionControl from "./StatusTransitionControl";
import type {
  CaseResponse,
  SensitivityLevel,
} from "@/types/case";

interface Props {
  caseData: CaseResponse;
}

export default function AdminCaseControls({
  caseData,
}: Props) {
  const { user } = useAuthStore();
  const {
    updateCaseStatus,
    updateCaseSensitivity,
    loading,
  } = useCaseStore();

  const isAdmin = user?.role === "ADMIN";

  if (!isAdmin) return null;

  const transitions = allowedTransitions[caseData.status];
  const isArchived = caseData.status === "ARCHIVED";

  return (
    <div className="bg-white border rounded-xl p-6 space-y-6">
      <h3 className="text-sm font-semibold text-gray-700">
        Admin Controls
      </h3>

      {isArchived && (
        <div className="text-xs text-gray-400">
          Case is archived and immutable.
        </div>
      )}

      {!isArchived && (
        <>
          <div className="space-y-2">
            <p className="text-xs text-gray-500">
              Update Status
            </p>

            <StatusTransitionControl
              currentStatus={caseData.status}
              transitions={transitions}
              loading={loading}
              onChange={(status) =>
                updateCaseStatus(caseData.id, status)
              }
            />
          </div>

          <div className="space-y-2">
            <p className="text-xs text-gray-500">
              Update Sensitivity
            </p>

            <select
              disabled={loading}
              value={caseData.sensitivityLevel}
              onChange={(e) =>
                updateCaseSensitivity(
                  caseData.id,
                  e.target.value as SensitivityLevel
                )
              }
              className="border rounded-md px-3 py-2 text-sm"
            >
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
              <option value="CRITICAL">CRITICAL</option>
            </select>
          </div>
        </>
      )}
    </div>
  );
}
