import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth.store";
import { usePartyStore } from "@/store/party.store";

interface Props {
  caseId: number;
}

const roleOrder = [
  "PETITIONER",
  "PLAINTIFF",
  "RESPONDENT",
  "DEFENDANT",
  "ACCUSED",
  "COMPLAINANT",
  "WITNESS",
  "OTHER",
];

export default function PartiesTab({ caseId }: Props) {
  const { user } = useAuthStore();
  const isAdmin = user?.role === "ADMIN";

  const {
    parties,
    loading,
    fetchParties,
    createParty,
    deleteParty,
  } = usePartyStore();

  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    name: "",
    role: "PETITIONER",
    advocateName: "",
    contactInfo: "",
    address: "",
    notes: "",
  });

  useEffect(() => {
    fetchParties(caseId);
  }, [caseId, fetchParties]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    await createParty(caseId, form);

    setForm({
      name: "",
      role: "PETITIONER",
      advocateName: "",
      contactInfo: "",
      address: "",
      notes: "",
    });

    setShowForm(false);
  }

  async function handleDelete(id: number) {
    await deleteParty(caseId, id);
  }

  const grouped = roleOrder
    .map((role) => ({
      role,
      parties: parties.filter((p) => p.role === role),
    }))
    .filter((group) => group.parties.length > 0);

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-lg font-semibold text-slate-900">
          Parties
        </h2>

        <button
          onClick={() => setShowForm((prev) => !prev)}
          className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm hover:bg-slate-800 transition"
        >
          {showForm ? "Cancel" : "Add Party"}
        </button>
      </div>

      {/* FORM */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white border rounded-2xl p-6 shadow-sm space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs text-slate-500">
                Name
              </label>
              <input
                required
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
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
                {roleOrder.map((role) => (
                  <option key={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-500">
                Advocate
              </label>
              <input
                value={form.advocateName}
                onChange={(e) =>
                  setForm({
                    ...form,
                    advocateName:
                      e.target.value,
                  })
                }
                className="mt-1 w-full border rounded-xl px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="text-xs text-slate-500">
                Contact Info
              </label>
              <input
                value={form.contactInfo}
                onChange={(e) =>
                  setForm({
                    ...form,
                    contactInfo:
                      e.target.value,
                  })
                }
                className="mt-1 w-full border rounded-xl px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-500">
              Address
            </label>
            <textarea
              rows={2}
              value={form.address}
              onChange={(e) =>
                setForm({
                  ...form,
                  address: e.target.value,
                })
              }
              className="mt-1 w-full border rounded-xl px-3 py-2 text-sm"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-xs text-slate-500">
              Internal Notes
            </label>
            <textarea
              rows={3}
              value={form.notes}
              onChange={(e) =>
                setForm({ ...form, notes: e.target.value })
              }
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              placeholder="Additional party details, legal remarks, or internal notes..."
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-slate-900 text-white px-5 py-2 rounded-xl text-sm hover:bg-slate-800 transition"
            >
              Save Party
            </button>
          </div>
        </form>
      )}

      {/* LIST */}
      {loading && (
        <div className="text-sm text-slate-500">
          Loading parties...
        </div>
      )}

      {!loading && grouped.length === 0 && (
        <div className="bg-white border rounded-2xl p-6 text-sm text-slate-500">
          No parties added yet.
        </div>
      )}

      <div className="space-y-6">
        {grouped.map((group) => (
          <div
            key={group.role}
            className="bg-white border rounded-2xl shadow-sm"
          >
            <div className="px-6 py-4 border-b text-sm font-semibold text-slate-800">
              {group.role}
            </div>

            <div className="divide-y">
              {group.parties.map((party) => (
                <div
                  key={party.id}
                  className="p-6 flex flex-col md:flex-row md:items-start md:justify-between gap-4"
                >
                  <div className="space-y-1 text-sm">
                    <div className="font-medium mb-2 text-[17px] text-slate-900">
                      {party.name}
                    </div>

                    {party.advocateName && (
                      <div className="text-slate-600">
                        Advocate: {party.advocateName}
                      </div>
                    )}

                    {party.contactInfo && (
                      <div className="text-slate-600">
                        {party.contactInfo}
                      </div>
                    )}

                    {party.address && (
                      <div className="text-slate-500 text-xs">
                        {party.address}
                      </div>
                    )}

                    {party.notes && (
                    <div className="text-md text-slate-800 mt-4 whitespace-pre-line">
                      {party.notes}
                    </div>
                  )}
                  </div>


                  {isAdmin && (
                    <button
                      onClick={() =>
                        handleDelete(party.id)
                      }
                      className="text-sm text-red-600 hover:text-red-800 transition"
                    >
                      Delete
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
