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
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Invites</h1>

      <div className="bg-white p-6 rounded-xl shadow mb-6">
  <h2 className="text-lg font-semibold mb-4">Create Invite</h2>

  <div className="flex gap-4">
    <input
      type="email"
      placeholder="Email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      className="border p-2 rounded w-64"
    />

    <select
      value={role}
      onChange={(e) => setRole(e.target.value)}
      className="border p-2 rounded"
    >
      <option value="USER">USER</option>
      <option value="ADMIN">ADMIN</option>
    </select>

    <select
      value={clearance}
      onChange={(e) => setClearance(e.target.value)}
      className="border p-2 rounded"
    >
      <option value="LOW">LOW</option>
      <option value="MEDIUM">MEDIUM</option>
      <option value="HIGH">HIGH</option>
      <option value="CRITICAL">CRITICAL</option>
    </select>

    <button
      onClick={create}
      className="bg-blue-600 text-white px-4 rounded"
    >
      Create
    </button>
  </div>
</div>

      <select
        className="border p-2 mb-4"
        onChange={(e) =>
          setStatusFilter(
            e.target.value as InviteStatus
          )
        }
      >
        <option value="">All</option>
        <option value="PENDING">Pending</option>
        <option value="REGISTERED">Registered</option>
        <option value="APPROVED">Approved</option>
        <option value="REJECTED">Rejected</option>
        <option value="TERMINATED">Terminated</option>
      </select>

      <div className="bg-white shadow rounded-lg">
        {invites.map((invite) => (
          <div
            key={invite.id}
            className="flex justify-between border-b p-4"
          >
            <div>
  <div className="font-medium">{invite.email}</div>

  <div className="text-sm text-gray-500">
    {invite.status}
  </div>

  <div className="text-xs text-gray-400 break-all mt-1">
    Token: {invite.token}
  </div>

<button
  onClick={() => handleCopy(invite.id, invite.token)}
  className="text-blue-600 text-xs hover:underline mt-1"
>
  {copiedId === invite.id ? "Copied!" : "Copy Invite Link"}
</button>
</div>

            <div className="flex gap-2">
             {invite.status === "REGISTERED" && (
  <>
    <button
      onClick={() => handleApprove(invite.id)}
      className="text-green-600 hover:underline"
    >
      Approve
    </button>
    <button
      onClick={() => handleReject(invite.id)}
      className="text-red-600 hover:underline"
    >
      Reject
    </button>
  </>
)}

              {invite.status === "PENDING" && (
  <button
    onClick={() => handleTerminate(invite.id)}
    className="text-red-600 hover:underline"
  >
    Terminate
  </button>
)}

{invite.status === "TERMINATED" && (
  <button
    onClick={() => handleDelete(invite.id)}
    className="text-gray-600 hover:underline"
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
