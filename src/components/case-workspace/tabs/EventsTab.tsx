import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth.store";
import { useEventStore } from "@/store/event.store";

interface Props {
  caseId: number;
}

const eventTypeStyles: Record<string, string> = {
  HEARING: "bg-blue-100 text-blue-700",
  FILING: "bg-purple-100 text-purple-700",
  ORDER: "bg-green-100 text-green-700",
  JUDGMENT: "bg-red-100 text-red-700",
  NOTE: "bg-slate-200 text-slate-700",
};

export default function EventsTab({ caseId }: Props) {
  const { user } = useAuthStore();
  const isAdmin = user?.role === "ADMIN";

  const {
    events,
    loading,
    fetchEvents,
    createEvent,
    deleteEvent,
  } = useEventStore();

  const [formOpen, setFormOpen] = useState(false);

  const [form, setForm] = useState({
    eventType: "NOTE",
    description: "",
    eventDate: "",
    nextDate: "",
  });

  useEffect(() => {
    fetchEvents(caseId);
  }, [caseId, fetchEvents]);

  async function handleCreate() {
    await createEvent(caseId, {
      eventType: form.eventType,
      description: form.description,
      eventDate: form.eventDate,
      nextDate: form.nextDate || null,
    });

    setForm({
      eventType: "NOTE",
      description: "",
      eventDate: "",
      nextDate: "",
    });

    setFormOpen(false);
  }

  async function handleDelete(id: number) {
    await deleteEvent(caseId, id);
  }

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-lg font-semibold text-slate-900">
          Case Timeline
        </h2>

        <button
          onClick={() => setFormOpen((prev) => !prev)}
          className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm hover:bg-slate-800 transition"
        >
          {formOpen ? "Cancel" : "Add Event"}
        </button>
      </div>

      {/* CREATE FORM */}
      {formOpen && (
        <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <select
              value={form.eventType}
              onChange={(e) =>
                setForm({
                  ...form,
                  eventType: e.target.value,
                })
              }
              className="border rounded-xl px-3 py-2 text-sm"
            >
              <option value="HEARING">Hearing</option>
              <option value="FILING">Filing</option>
              <option value="ORDER">Order</option>
              <option value="JUDGMENT">Judgment</option>
              <option value="NOTE">Note</option>
            </select>

            <input
              type="date"
              value={form.eventDate}
              onChange={(e) =>
                setForm({
                  ...form,
                  eventDate: e.target.value,
                })
              }
              className="border rounded-xl px-3 py-2 text-sm"
            />
          </div>

          <input
            type="date"
            value={form.nextDate}
            onChange={(e) =>
              setForm({
                ...form,
                nextDate: e.target.value,
              })
            }
            className="border rounded-xl px-3 py-2 text-sm"
            placeholder="Next hearing date (optional)"
          />

          <textarea
            rows={3}
            value={form.description}
            onChange={(e) =>
              setForm({
                ...form,
                description: e.target.value,
              })
            }
            placeholder="Event description"
            className="w-full border rounded-xl px-3 py-2 text-sm"
          />

          <div className="flex justify-end">
            <button
              onClick={handleCreate}
              className="bg-slate-900 text-white px-5 py-2 rounded-xl text-sm hover:bg-slate-800 transition"
            >
              Save Event
            </button>
          </div>
        </div>
      )}

      {/* LOADING */}
      {loading && (
        <div className="text-sm text-slate-500">
          Loading timeline...
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && events.length === 0 && (
        <div className="bg-white border rounded-2xl p-8 text-center text-sm text-slate-500">
          No events recorded.
        </div>
      )}

      {/* TIMELINE */}
      <div className="space-y-6">
        {events.map((event) => (
          <div
            key={event.id}
            className="bg-white border rounded-2xl p-6 shadow-sm"
          >
            <div className="flex flex-col md:flex-row md:justify-between gap-6">
              <div className="space-y-3 text-sm">
                <span
                  className={`inline-block px-2 py-1 text-xs rounded-md font-medium ${
                    eventTypeStyles[event.eventType] ??
                    "bg-slate-100 text-slate-700"
                  }`}
                >
                  {event.eventType}
                </span>

                <p className="text-slate-800 whitespace-pre-line">
                  {event.description}
                </p>

                <div className="text-xs text-slate-500">
                  Event Date:{" "}
                  {new Date(
                    event.eventDate
                  ).toLocaleDateString()}
                </div>

                {event.nextDate && (
                  <div className="text-xs text-blue-600 font-medium">
                    Next Hearing:{" "}
                    {new Date(
                      event.nextDate
                    ).toLocaleDateString()}
                  </div>
                )}

                <div className="text-xs text-slate-400">
                  Added by {event.createdBy} •{" "}
                  {new Date(
                    event.createdAt
                  ).toLocaleString()}
                </div>
              </div>

              {isAdmin && (
                <div className="flex md:items-start">
                  <button
                    onClick={() =>
                      handleDelete(event.id)
                    }
                    className="text-xs text-red-600 hover:text-red-700 transition"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
