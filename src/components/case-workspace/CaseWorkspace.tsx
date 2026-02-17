import { useState } from "react";
import { useCaseStore } from "@/store/case.store";
import OverviewTab from "./tabs/OverviewTab";
import PartiesTab from "./tabs/PartiesTab";
import EventsTab from "./tabs/EventsTab";
import AssignmentsTab from "./tabs/AssignmentsTab";
import DocumentsTab from "./tabs/DocumentsTab";
import CommentsTab from "./tabs/CommentsTab";

interface Props {
  caseId: number;
}

type Tab =
  | "overview"
  | "parties"
  | "events"
  | "assignments"
  | "documents"
  | "comments";

export default function CaseWorkspace({ caseId }: Props) {
  const { selectedCase, loading } = useCaseStore();
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  if (loading || !selectedCase) {
  return (
    <div className="space-y-6">

      <div className="bg-white border rounded-2xl shadow-sm overflow-hidden animate-pulse opacity-80">

        {/* Fake Tabs */}
        <div className="hidden sm:flex border-b px-4 sm:px-6 py-3 gap-6">
          <div className="h-4 w-20 bg-slate-200 rounded" />
          <div className="h-4 w-16 bg-slate-200 rounded" />
          <div className="h-4 w-16 bg-slate-200 rounded" />
          <div className="h-4 w-24 bg-slate-200 rounded" />
          <div className="h-4 w-20 bg-slate-200 rounded" />
        </div>

        {/* Mobile Dropdown Skeleton */}
        <div className="sm:hidden border-b p-4">
          <div className="h-10 w-full bg-slate-200 rounded-xl" />
        </div>

        {/* Fake Content */}
        <div className="p-4 sm:p-6 space-y-6">

          {/* Section Title */}
          <div className="h-5 w-48 bg-slate-200 rounded" />

          {/* Content Blocks */}
          <div className="space-y-4">
            <div className="h-4 w-full bg-slate-200 rounded" />
            <div className="h-4 w-5/6 bg-slate-200 rounded" />
            <div className="h-4 w-2/3 bg-slate-200 rounded" />
          </div>

          {/* Card Placeholder */}
          <div className="bg-slate-100 rounded-2xl p-6 space-y-4">
            <div className="h-4 w-32 bg-slate-200 rounded" />
            <div className="h-4 w-full bg-slate-200 rounded" />
            <div className="h-4 w-4/5 bg-slate-200 rounded" />
          </div>

        </div>
      </div>
    </div>
  );
}

  const tabs: { key: Tab; label: string }[] = [
    { key: "overview", label: "Overview" },
    { key: "parties", label: "Parties" },
    { key: "events", label: "Events" },
    { key: "assignments", label: "Assignments" },
    { key: "documents", label: "Documents" },
    { key: "comments", label: "Notes" },
  ];

return (
  <div className="space-y-6">

    {/* =========================
         TABS CONTAINER
    ========================= */}
    <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">

      {/* Mobile Tab Selector (Dropdown) */}
      <div className="sm:hidden border-b p-4">
        <select
          value={activeTab}
          onChange={(e) => setActiveTab(e.target.value as Tab)}
          className="w-full border rounded-xl px-3 py-2 text-sm bg-white"
        >
          {tabs.map((tab) => (
            <option key={tab.key} value={tab.key}>
              {tab.label}
            </option>
          ))}
        </select>
      </div>

      {/* Desktop Tab Navigation */}
      <div className="hidden sm:flex overflow-x-auto border-b scrollbar-hide">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;

          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-3 text-sm whitespace-nowrap transition border-b-2 ${
                isActive
                  ? "border-slate-900 text-slate-900 font-medium"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="p-4 sm:p-6">

        {activeTab === "overview" && <OverviewTab />}

        {activeTab === "parties" && (
          <PartiesTab caseId={caseId} />
        )}

        {activeTab === "events" && (
          <EventsTab caseId={caseId} />
        )}

        {activeTab === "assignments" && (
          <AssignmentsTab caseId={caseId} />
        )}

        {activeTab === "documents" && (
          <DocumentsTab caseId={caseId} />
        )}

        {activeTab === "comments" && (
          <CommentsTab caseId={caseId} />
        )}

      </div>
    </div>
  </div>
);
}
