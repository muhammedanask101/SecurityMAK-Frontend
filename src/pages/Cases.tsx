import { useEffect, useState } from "react";
import { getCases } from "../api/case.api";
import type { CaseDto } from "../types/case";
import CaseStatusBadge from "../components/CaseStatusBadge";
import { useNavigate } from "react-router-dom";

export default function Cases() {

const navigate = useNavigate();

  const [cases, setCases] = useState<CaseDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCases() {
      try {
        const data = await getCases();
        setCases(data);
      } finally {
        setLoading(false);
      }
    }

    fetchCases();
  }, []);

  if (loading) {
    return <div>Loading cases...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Cases</h1>

      <div className="bg-white rounded shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50">
            <tr>
              <th className="p-3 text-sm font-medium">Title</th>
              <th className="p-3 text-sm font-medium">Status</th>
              <th className="p-3 text-sm font-medium">Sensitivity</th>
              <th className="p-3 text-sm font-medium">Created</th>
            </tr>
          </thead>

          <tbody>
            {cases.map((c) => (
              <tr
                key={c.id}
                onClick={() => navigate(`/cases/${c.id}`)}
                className="border-t hover:bg-slate-50 cursor-pointer"
                >
                <td className="p-3">{c.title}</td>
                <td className="p-3">
                  <CaseStatusBadge status={c.status} />
                </td>
                <td className="p-3">{c.sensitivityLevel}</td>
                <td className="p-3">
                  {new Date(c.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
