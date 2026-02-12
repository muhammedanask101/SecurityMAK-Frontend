// pages/cases/CaseDetailPage.tsx

import { useEffect } from "react";
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

  const isOwner =
    user?.email === selectedCase.ownerEmail;

  return (
    <div className="p-8 max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">
          {selectedCase.title}
        </h1>

        <div className="mt-3">
          <span
            className={`px-2 py-1 text-xs font-medium rounded-md ${statusStyles[selectedCase.status]}`}
          >
            {selectedCase.status}
          </span>
        </div>
      </div>

      <CaseEditForm
        caseData={selectedCase}
        isOwner={isOwner}
      />

      <AdminCaseControls caseData={selectedCase} />

      <CaseComments caseId={selectedCase.id} />
    </div>
  );
}
