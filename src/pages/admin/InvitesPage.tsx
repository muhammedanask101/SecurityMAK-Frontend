import { useEffect, useState } from "react";
import { inviteApi } from "../../api/invite.api";
import type { InviteView, InviteStatus } from "../../types/invite";

export default function InvitesPage() {
  const [invites, setInvites] = useState<InviteView[]>([]);
  const [statusFilter, setStatusFilter] = useState<InviteStatus | undefined>();

  const [email, setEmail] = useState("");
    const [role, setRole] = useState("USER");
    const [clearance, setClearance] = useState("LOW");
    

    const create = async () => {

        if (!email.trim()) {
    alert("Email is required");
    return;
  }

    await inviteApi.createInvite({
        email: email.trim(),
        role,
        clearanceLevel: clearance,
    });

  setEmail("");
  fetchInvites(); 
};

  const fetchInvites = async () => {
    const res = await inviteApi.getInvites(statusFilter);
    setInvites(res.data.content);
  };

  const loadInvites = async () => {
  await fetchInvites(); // or your existing loader
};

const handleApprove = async (id: number) => {
  await inviteApi.approveInvite(id);
  await loadInvites();
};

const handleReject = async (id: number) => {
  await inviteApi.rejectInvite(id);
  await loadInvites();
};

const handleTerminate = async (id: number) => {
  await inviteApi.terminateInvite(id);
  await loadInvites();
};

const handleDelete = async (id: number) => {
  const confirmed = window.confirm(
    "This will permanently delete the invite. Continue?"
  );

  if (!confirmed) return;

  await inviteApi.deleteInvite(id);
  await loadInvites();
};

const [copiedId, setCopiedId] = useState<number | null>(null);

const handleCopy = async (id: number, token: string) => {
  const link = `${window.location.origin}/accept-invite?token=${token}`;

  try {
    await navigator.clipboard.writeText(link);
    setCopiedId(id);

    setTimeout(() => setCopiedId(null), 2000);
  } catch (err) {
    console.error(err);
  }
};

useEffect(() => {
  let isMounted = true;

  const load = async () => {
    const res = await inviteApi.getInvites(statusFilter);
    if (isMounted) {
      setInvites(res.data.content);
    }
  };

  load();

  return () => {
    isMounted = false;
  };
}, [statusFilter]);


return (
  <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8">
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">
        Invites
      </h1>
      <p className="text-sm text-slate-600 mt-2">
        Tenant-scoped invitation management
      </p>
    </div>

    {/* Create Invite */}
    <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-6">
      <h2 className="text-lg font-semibold text-slate-900">
        Create Invite
      </h2>

      <div className="flex flex-col md:flex-row gap-4">
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border rounded-md px-3 py-2 text-sm w-full md:w-72"
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="border rounded-md px-3 py-2 text-sm w-full md:w-40"
        >
          <option value="USER">USER</option>
          <option value="ADMIN">ADMIN</option>
        </select>

        <select
          value={clearance}
          onChange={(e) => setClearance(e.target.value)}
          className="border rounded-md px-3 py-2 text-sm w-full md:w-40"
        >
          <option value="LOW">LOW</option>
          <option value="MEDIUM">MEDIUM</option>
          <option value="HIGH">HIGH</option>
          <option value="CRITICAL">CRITICAL</option>
        </select>

        <button
          onClick={create}
          className="px-4 py-2 bg-slate-900 text-white text-sm rounded-md hover:bg-slate-800 w-full md:w-auto"
        >
          Create Invite
        </button>
      </div>
    </div>

    {/* Filter */}
    <div className="flex flex-col md:flex-row md:items-center gap-4">
      <select
        className="border rounded-md px-3 py-2 text-sm w-full md:w-56"
        onChange={(e) =>
          setStatusFilter(
            e.target.value as InviteStatus
          )
        }
      >
        <option value="">All Statuses</option>
        <option value="PENDING">Pending</option>
        <option value="REGISTERED">Registered</option>
        <option value="APPROVED">Approved</option>
        <option value="REJECTED">Rejected</option>
        <option value="TERMINATED">Terminated</option>
      </select>
    </div>

    {/* Invite List */}

{/* Mobile Cards */}
<div className="md:hidden space-y-4">
  {invites.map((invite) => (
    <div
      key={invite.id}
      className="bg-white border rounded-2xl p-4 shadow-sm space-y-3"
    >
      <div className="font-medium text-slate-800 break-all">
        {invite.email}
      </div>

      <div className="text-xs text-slate-500 uppercase tracking-wide">
        {invite.status}
      </div>

      <div className="text-xs text-slate-400 break-all">
        Token: {invite.token}
      </div>

      <button
        onClick={() => handleCopy(invite.id, invite.token)}
        className="text-xs text-blue-600 hover:underline"
      >
        {copiedId === invite.id
          ? "Copied!"
          : "Copy Invite Link"}
      </button>

      <div className="flex flex-wrap gap-2 pt-2">
        {invite.status === "REGISTERED" && (
          <>
            <button
              onClick={() => handleApprove(invite.id)}
              className="flex-1 px-3 py-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 text-xs"
            >
              Approve
            </button>

            <button
              onClick={() => handleReject(invite.id)}
              className="flex-1 px-3 py-2 rounded-lg bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 text-xs"
            >
              Reject
            </button>
          </>
        )}

        {invite.status === "PENDING" && (
          <button
            onClick={() => handleTerminate(invite.id)}
            className="w-full px-3 py-2 rounded-lg bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 text-xs"
          >
            Terminate
          </button>
        )}

        {invite.status === "TERMINATED" && (
          <button
            onClick={() => handleDelete(invite.id)}
            className="w-full px-3 py-2 rounded-lg bg-slate-100 text-slate-700 border border-slate-300 hover:bg-slate-200 text-xs"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  ))}
</div>

{/* Desktop Joined List */}
<div className="hidden md:block bg-white border rounded-2xl shadow-sm divide-y">
  {invites.map((invite) => (
    <div
      key={invite.id}
      className="p-6 flex items-center justify-between gap-6"
    >
      <div className="space-y-2">
        <div className="font-medium text-slate-800">
          {invite.email}
        </div>

        <div className="text-xs text-slate-500 uppercase tracking-wide">
          {invite.status}
        </div>

        <div className="text-xs text-slate-400 break-all">
          Token: {invite.token}
        </div>

        <button
          onClick={() =>
            handleCopy(invite.id, invite.token)
          }
          className="text-xs text-blue-600 hover:underline"
        >
          {copiedId === invite.id
            ? "Copied!"
            : "Copy Invite Link"}
        </button>
      </div>

      <div className="flex flex-wrap gap-3 text-xs font-medium">
        {invite.status === "REGISTERED" && (
          <>
            <button
              onClick={() => handleApprove(invite.id)}
              className="px-3 py-1.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
            >
              Approve
            </button>

            <button
              onClick={() => handleReject(invite.id)}
              className="px-3 py-1.5 rounded-md bg-red-50 text-red-700 border border-red-200 hover:bg-red-100"
            >
              Reject
            </button>
          </>
        )}

        {invite.status === "PENDING" && (
          <button
            onClick={() => handleTerminate(invite.id)}
            className="px-3 py-1.5 rounded-md bg-red-50 text-red-700 border border-red-200 hover:bg-red-100"
          >
            Terminate
          </button>
        )}

        {invite.status === "TERMINATED" && (
          <button
            onClick={() => handleDelete(invite.id)}
            className="px-3 py-1.5 rounded-md bg-slate-100 text-slate-700 border border-slate-300 hover:bg-slate-200"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  ))}
</div>
</div>
);

}
