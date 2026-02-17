import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCaseStore } from "@/store/case.store";
import { useAuthStore } from "@/store/auth.store";
import CaseWorkspace from "@/components/case-workspace/CaseWorkspace";
import CaseEditDrawer from "@/components/cases/CaseEditDrawer";

const sensitivityStyles: Record<string, string> = {
  LOW: "bg-green-100 text-green-700",
  MEDIUM: "bg-yellow-100 text-yellow-700",
  HIGH: "bg-orange-100 text-orange-700",
  CRITICAL: "bg-red-100 text-red-700",
};

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
  const [editOpen, setEditOpen] = useState(false);

  /* =============================
     Fetch Case
  ============================== */
  useEffect(() => {
    if (!Number.isNaN(caseId)) {
      fetchCaseById(caseId);
    }
  }, [caseId, fetchCaseById]);

  /* =============================
     Lock Background Scroll
  ============================== */
  useEffect(() => {
    document.body.style.overflow = editOpen ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [editOpen]);

  /* =============================
     Loading / Error
  ============================== */
  if (loading) {
  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-pulse">

      {/* Header Skeleton */}
      <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-4">
        <div className="h-7 w-64 bg-slate-200 rounded" />
        <div className="flex gap-3">
          <div className="h-5 w-24 bg-slate-200 rounded" />
          <div className="h-5 w-20 bg-slate-200 rounded" />
          <div className="h-5 w-16 bg-slate-200 rounded" />
        </div>
      </div>

      {/* Workspace Skeleton */}
      <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">

        {/* Tabs Skeleton */}
        <div className="border-b p-4 flex gap-6">
          <div className="h-4 w-20 bg-slate-200 rounded" />
          <div className="h-4 w-20 bg-slate-200 rounded" />
          <div className="h-4 w-24 bg-slate-200 rounded" />
          <div className="h-4 w-28 bg-slate-200 rounded" />
        </div>

        {/* Content Skeleton */}
        <div className="p-6 space-y-4">
          <div className="h-4 w-3/4 bg-slate-200 rounded" />
          <div className="h-4 w-5/6 bg-slate-200 rounded" />
          <div className="h-4 w-2/3 bg-slate-200 rounded" />
          <div className="h-32 bg-slate-200 rounded-xl" />
        </div>

      </div>

    </div>
  );
}

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-8 text-sm text-red-600">
        {error}
      </div>
    );
  }

  if (!selectedCase) return null;

  /* =============================
     Derived Values (AFTER null check)
  ============================== */
  const sensitivityClass =
    sensitivityStyles[selectedCase.sensitivityLevel] ??
    "bg-slate-100 text-slate-700";

  const isOwner = user?.email === selectedCase.ownerEmail;
  const isAdmin = user?.role === "ADMIN";

  const canEdit = isOwner || isAdmin;

  /* =============================
     Render
  ============================== */
  return (
    <div className="max-w-7xl mx-auto space-y-8 relative">

      {/* =============================
         HEADER
      ============================== */}
      <div className="bg-white border rounded-2xl p-6 shadow-sm flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-slate-900">
            {selectedCase.title}
          </h1>

          <div className="flex items-center gap-3 text-sm text-slate-500">
            <span>Case #{selectedCase.id}</span>

            <span
              className={`px-2 py-1 text-xs rounded-md font-medium ${sensitivityClass}`}
            >
              {selectedCase.sensitivityLevel}
            </span>

            <span className="px-2 py-1 rounded-md bg-slate-100 text-slate-700 text-xs">
              {selectedCase.status}
            </span>
          </div>
        </div>

        {canEdit && (
          <button
            onClick={() => setEditOpen(true)}
            className="px-5 py-2 bg-slate-900 text-white text-sm rounded-xl hover:bg-slate-800 transition"
          >
            Edit Case
          </button>
        )}
      </div>

      {/* =============================
         WORKSPACE
      ============================== */}
      <CaseWorkspace caseId={caseId} />

      {/* =============================
         EDIT DRAWER LAYER
      ============================== */}
      {editOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-slate-900/20 z-40"
            onClick={() => setEditOpen(false)}
          />

          {/* Drawer */}
          <div className="fixed inset-y-0 right-0 z-50 flex">
            <CaseEditDrawer
              caseData={selectedCase}
              onClose={() => setEditOpen(false)}
            />
          </div>
        </>
      )}
    </div>
  );
}
