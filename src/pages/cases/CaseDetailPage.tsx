import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCaseStore } from "@/store/case.store";
import { useAuthStore } from "@/store/auth.store";
import { statusStyles } from "@/lib/caseStyles";
import AdminCaseControls from "@/components/cases/AdminCaseControls";
import CaseEditForm from "@/components/cases/CaseEditForm";
import CaseComments from "@/components/cases/CaseComments";

export default function CaseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const caseId = Number(id);

  const {
    selectedCase,
    fetchCaseById,
    loading,
    error,
  } = useCaseStore();

  const { user } = useAuthStore();

  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (!Number.isNaN(caseId)) {
      fetchCaseById(caseId);
    }
  }, [caseId]);

  if (loading || !selectedCase) {
    return (
      <div className="p-6 text-sm text-gray-500">
        Loading case...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-sm text-red-600">
        {error}
      </div>
    );
  }

  const isOwner = user?.email === selectedCase.ownerEmail;

  const editableStatuses = ["OPEN", "IN_PROGRESS"];
  const canEdit =
    isOwner && editableStatuses.includes(selectedCase.status);

  const sensitivityStyles: Record<string, string> = {
    LOW: "bg-green-100 text-green-700",
    MEDIUM: "bg-yellow-100 text-yellow-700",
    HIGH: "bg-orange-100 text-orange-700",
    CRITICAL: "bg-red-100 text-red-700",
  };

  return (
    <div className="p-8 max-w-4xl space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold text-gray-800">
          {selectedCase.title}
        </h1>

        <div className="flex items-center gap-3">
          <span
            className={`px-2 py-1 text-xs font-medium rounded-md ${statusStyles[selectedCase.status]}`}
          >
            {selectedCase.status}
          </span>

          <span
            className={`px-2 py-1 text-xs font-medium rounded-md ${
              sensitivityStyles[selectedCase.sensitivityLevel]
            }`}
          >
            {selectedCase.sensitivityLevel}
          </span>
        </div>
      </div>

      {/* View / Edit Section */}
      {!editMode ? (
        <div className="bg-white border rounded-2xl p-6 space-y-6 shadow-sm">
          <div>
            <p className="text-xs text-gray-500 mb-2">
              Description
            </p>
            <p className="text-sm text-gray-700 whitespace-pre-line">
              {selectedCase.description}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
            <div>
              <p className="text-gray-500">Owner</p>
              <p className="font-medium text-gray-800">
                {selectedCase.ownerEmail}
              </p>
            </div>

            <div>
              <p className="text-gray-500">Created</p>
              <p className="font-medium text-gray-800">
                {new Date(
                  selectedCase.createdAt
                ).toLocaleString()}
              </p>
            </div>

            <div>
              <p className="text-gray-500">Last Updated</p>
              <p className="font-medium text-gray-800">
                {new Date(
                  selectedCase.updatedAt
                ).toLocaleString()}
              </p>
            </div>
          </div>

          {canEdit && (
            <button
              onClick={() => setEditMode(true)}
              className="px-4 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800 transition"
            >
              Edit Case
            </button>
          )}
        </div>
      ) : (
        <CaseEditForm
          caseData={selectedCase}
          isOwner={isOwner}
          onCancel={() => setEditMode(false)}
          onSaved={() => setEditMode(false)}
        />
      )}

      <AdminCaseControls caseData={selectedCase} />

      <CaseComments caseId={selectedCase.id} />
    </div>
  );
}
