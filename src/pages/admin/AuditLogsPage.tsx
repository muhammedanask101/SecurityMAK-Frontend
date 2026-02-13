import { useEffect, useState } from "react";
import { auditApi } from "@/api/audit.api";
import type { AuditLog } from "@/types/audit";

const ACTION_OPTIONS = [
  "USER_REGISTERED",
  "USER_LOGIN",
  "CASE_CREATED",
  "CASE_UPDATED",
  "STATUS_CHANGED",
  "SENSITIVITY_CHANGED",
  "COMMENT_ADDED",
  "COMMENT_DELETED",
  "USER_ROLE_CHANGED",
];

const TARGET_TYPES = ["USER", "CASE", "COMMENT", "ROLE"];

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const [loading, setLoading] = useState(false);

  // Filters
  const [actorEmail, setActorEmail] = useState("");
  const [action, setAction] = useState("");
  const [targetType, setTargetType] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  async function loadLogs(p = 0) {
    try {
      setLoading(true);

      const data = await auditApi.getAuditLogs({
        page: p,
        size: 20,
        actorEmail: actorEmail || undefined,
        action: action || undefined,
        targetType: targetType || undefined,
        from: from || undefined,
        to: to || undefined,
      });

      setLogs(data.content);
      setPage(data.number);
      setTotalPages(data.totalPages);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLogs(0);
  }, []);

  function resetFilters() {
    setActorEmail("");
    setAction("");
    setTargetType("");
    setFrom("");
    setTo("");
    loadLogs(0);
  }

  const actionStyles: Record<string, string> = {
    USER_LOGIN: "bg-blue-100 text-blue-700",
    USER_REGISTERED: "bg-green-100 text-green-700",
    CASE_CREATED: "bg-emerald-100 text-emerald-700",
    CASE_UPDATED: "bg-yellow-100 text-yellow-700",
    STATUS_CHANGED: "bg-indigo-100 text-indigo-700",
    SENSITIVITY_CHANGED: "bg-orange-100 text-orange-700",
    COMMENT_ADDED: "bg-purple-100 text-purple-700",
    COMMENT_DELETED: "bg-red-100 text-red-700",
    USER_ROLE_CHANGED: "bg-pink-100 text-pink-700",
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          Audit Logs
        </h1>
        <p className="text-sm text-slate-600 mt-2">
          Trace system activity across tenants and users.
        </p>
      </div>

      {/* Filters Panel */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
        <h2 className="text-sm font-semibold text-slate-800">
          Filter Activity
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">

          <input
            placeholder="Actor Email"
            value={actorEmail}
            onChange={(e) => setActorEmail(e.target.value)}
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm"
          />

          <select
            value={action}
            onChange={(e) => setAction(e.target.value)}
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="">All Actions</option>
            {ACTION_OPTIONS.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>

          <select
            value={targetType}
            onChange={(e) => setTargetType(e.target.value)}
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="">All Targets</option>
            {TARGET_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          <input
            type="datetime-local"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm"
          />

          <input
            type="datetime-local"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => loadLogs(0)}
            className="px-4 py-2 bg-slate-900 text-white text-sm rounded-lg hover:bg-slate-800 transition"
          >
            Apply
          </button>

          <button
            onClick={resetFilters}
            className="px-4 py-2 border border-slate-300 text-sm rounded-lg hover:bg-slate-50 transition"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-slate-600 sticky top-0">
            <tr>
              <th className="px-6 py-3 text-left">Time</th>
              <th className="px-6 py-3 text-left">Actor</th>
              <th className="px-6 py-3 text-left">Action</th>
              <th className="px-6 py-3 text-left">Target</th>
              <th className="px-6 py-3 text-left">Details</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <>
                <tr
                  key={log.id}
                  className="border-t hover:bg-slate-50 transition cursor-pointer"
                  onClick={() =>
                    setExpandedId(expandedId === log.id ? null : log.id)
                  }
                >
                  <td className="px-6 py-4 text-slate-500">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>

                  <td className="px-6 py-4 font-medium text-slate-800">
                    {log.actorEmail}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs rounded-md font-medium ${
                        actionStyles[log.action] ??
                        "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {log.action}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-slate-700">
                    {log.targetType} #{log.targetId}
                  </td>

                  <td className="px-6 py-4 text-slate-500">
                    Click to expand
                  </td>
                </tr>

                {expandedId === log.id && (
                  <tr className="bg-slate-50">
                    <td colSpan={5} className="px-6 py-4 text-xs space-y-2">
                      <div>
                        <span className="font-semibold text-slate-700">
                          Old Value:
                        </span>
                        <pre className="mt-1 bg-white border rounded-md p-3 overflow-x-auto">
                          {log.oldValue ?? "—"}
                        </pre>
                      </div>

                      <div>
                        <span className="font-semibold text-slate-700">
                          New Value:
                        </span>
                        <pre className="mt-1 bg-white border rounded-md p-3 overflow-x-auto">
                          {log.newValue ?? "—"}
                        </pre>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>

        {loading && (
          <div className="p-6 text-sm text-slate-500">
            Loading audit logs...
          </div>
        )}

        {!loading && logs.length === 0 && (
          <div className="p-6 text-sm text-slate-500">
            No audit logs found.
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex gap-2 flex-wrap">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => loadLogs(i)}
            className={`px-3 py-1 text-sm rounded-md border ${
              i === page
                ? "bg-slate-900 text-white"
                : "bg-white hover:bg-slate-50"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
