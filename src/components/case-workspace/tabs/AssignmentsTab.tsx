import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth.store";
import { useAssignmentStore } from "@/store/assignment.store";

interface Props {
  caseId: number;
}

export default function AssignmentsTab({ caseId }: Props) {
  const { user } = useAuthStore();
  const isAdmin = user?.role === "ADMIN";

  const {
    assignments,
    loading,
    fetchAssignments,
    createAssignment,
    deleteAssignment,
  } = useAssignmentStore();

  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    userEmail: "",
    role: "LEAD",
  });

  useEffect(() => {
    fetchAssignments(caseId);
  }, [caseId, fetchAssignments]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    await createAssignment(caseId, {
      userEmail: form.userEmail,
      role: form.role,
    });

    setForm({
      userEmail: "",
      role: "LEAD",
    });

    setShowForm(false);
  }

  async function handleDelete(id: number) {
    await deleteAssignment(caseId, id);
  }

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-slate-900">
          Case Assignments
        </h2>

        {isAdmin && (
          <button
            onClick={() => setShowForm((prev) => !prev)}
            className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm"
          >
            {showForm ? "Cancel" : "Assign Member"}
          </button>
        )}
      </div>

      {/* FORM */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white border rounded-2xl p-6 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div>
            <label className="text-xs text-slate-500">
              User Email
            </label>
            <input
              required
              type="email"
              value={form.userEmail}
              onChange={(e) =>
                setForm({
                  ...form,
                  userEmail: e.target.value,
                })
              }
              className="mt-1 w-full border rounded-xl px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="text-xs text-slate-500">
              Role
            </label>
            <select
              value={form.role}
              onChange={(e) =>
                setForm({
                  ...form,
                  role: e.target.value,
                })
              }
              className="mt-1 w-full border rounded-xl px-3 py-2 text-sm"
            >
              <option value="LEAD">LEAD</option>
              <option value="ASSISTANT">ASSISTANT</option>
              <option value="REVIEWER">REVIEWER</option>
            </select>
          </div>

          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              className="bg-slate-900 text-white px-5 py-2 rounded-xl text-sm"
            >
              Create Assignment
            </button>
          </div>
        </form>
      )}

      {/* LOADING */}
      {loading && (
        <div className="text-sm text-slate-500">
          Loading assignments...
        </div>
      )}

      {/* EMPTY */}
      {!loading && assignments.length === 0 && (
        <div className="bg-white border rounded-2xl p-6 text-sm text-slate-500">
          No assignments yet.
        </div>
      )}

      {/* LIST */}
      <div className="space-y-4">
        {assignments.map((assignment) => (
          <div
            key={assignment.id}
            className="bg-white border rounded-2xl shadow-sm p-6 flex justify-between items-center"
          >
            <div className="space-y-2 text-sm">
              <div className="font-medium text-slate-900">
                {assignment.userEmail}
              </div>

              <div className="text-slate-600">
                Role: {assignment.role}
              </div>

              <div className="text-xs text-slate-500">
                Assigned:{" "}
                {new Date(
                  assignment.assignedAt
                ).toLocaleDateString()}
              </div>
            </div>

            {isAdmin && (
              <button
                onClick={() =>
                  handleDelete(assignment.id)
                }
                className="text-red-600 hover:text-red-800 text-sm"
              >
                Remove
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
