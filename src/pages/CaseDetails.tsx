import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCaseById } from "../api/case.api";
import type { CaseDto } from "../types/case";
import CaseStatusBadge from "../components/CaseStatusBadge";
import UpdateStatusSection from "../components/UpdateStatusSection";

export default function CaseDetails() {
  const { id } = useParams();
  const [caseData, setCaseData] = useState<CaseDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCase() {
      if (!id) return;

      try {
        const data = await getCaseById(Number(id));
        setCaseData(data);
      } finally {
        setLoading(false);
      }
    }

    fetchCase();
  }, [id]);

  if (loading) return <div>Loading case...</div>;
  if (!caseData) return <div>Case not found.</div>;

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">
        {caseData.title}
      </h1>

      <div className="bg-white rounded shadow p-6 space-y-4">
        <div>
          <span className="text-sm text-slate-500">Status</span>
          <div>
            <CaseStatusBadge status={caseData.status} />
          </div>
        </div>

        <div>
          <span className="text-sm text-slate-500">Sensitivity</span>
          <p>{caseData.sensitivityLevel}</p>
        </div>

        <div>
          <span className="text-sm text-slate-500">Description</span>
          <p className="mt-1">{caseData.description}</p>
        </div>

        <div>
          <span className="text-sm text-slate-500">Created</span>
          <p>{new Date(caseData.createdAt).toLocaleString()}</p>
        </div>
      </div>

      <UpdateStatusSection
        caseId={caseData.id}
        currentStatus={caseData.status}
        onStatusUpdated={(newStatus) =>
            setCaseData({ ...caseData, status: newStatus })
        }
      />

    </div>
  );
}
