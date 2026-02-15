import { useCaseStore } from "@/store/case.store";

export default function OverviewTab() {
  const { selectedCase } = useCaseStore();

  if (!selectedCase) return null;


  return (
    <div className="space-y-8">
      {/* =================================
          HEADER SECTION
      ================================= */}
      <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-6">

        <div>
          <p className="text-xs text-slate-500 mb-2">
            Matter Description
          </p>
          <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">
            {selectedCase.description || "—"}
          </p>
        </div>
      </div>

      {/* =================================
          CLASSIFICATION
      ================================= */}
      <Section title="Classification">
        <Info label="Case Type" value={selectedCase.caseType} />
        <Info label="Matter Type" value={selectedCase.matterType} />
        <Info label="Stage" value={selectedCase.stage} />
        <Info label="Court Level" value={selectedCase.courtLevel} />
      </Section>

      {/* =================================
          COURT DETAILS
      ================================= */}
      <Section title="Court Details">
        <Info label="Court Name" value={selectedCase.courtName} />
        <Info label="State" value={selectedCase.state} />
        <Info label="District" value={selectedCase.district} />
        <Info label="Case Number" value={selectedCase.caseNumber} />
        <Info label="Judge" value={selectedCase.judgeName} />
      </Section>

      {/* =================================
          PARTIES & OWNERSHIP
      ================================= */}
      <Section title="Parties & Responsibility">
        <Info label="Client" value={selectedCase.clientName} />
        <Info
          label="Opposing Party"
          value={selectedCase.opposingPartyName}
        />
        <Info
          label="Assigned Advocate"
          value={selectedCase.assignedAdvocate}
        />
        <Info
          label="Owner (System)"
          value={selectedCase.ownerEmail}
        />
      </Section>

      {/* =================================
          IMPORTANT DATES
      ================================= */}
      <Section title="Important Dates">
        <DateInfo
          label="Filing Date"
          value={selectedCase.filingDate}
        />
        <DateInfo
          label="Registration Date"
          value={selectedCase.registrationDate}
        />
        <DateInfo
          label="Created"
          value={selectedCase.createdAt}
        />
        <DateInfo
          label="Last Updated"
          value={selectedCase.updatedAt}
        />
      </Section>
    </div>
  );
}

/* =====================================
   SECTION WRAPPER
===================================== */

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white border rounded-2xl p-6 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-900 mb-4">
        {title}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
        {children}
      </div>
    </div>
  );
}

/* =====================================
   INFO FIELD
===================================== */

function Info({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  return (
    <div>
      <p className="text-slate-500 text-xs mb-1">
        {label}
      </p>
      <p className="text-slate-900 font-medium">
        {value ?? "—"}
      </p>
    </div>
  );
}

/* =====================================
   DATE FIELD
===================================== */

function DateInfo({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  return (
    <div>
      <p className="text-slate-500 text-xs mb-1">
        {label}
      </p>
      <p className="text-slate-900 font-medium">
        {value
          ? new Date(value).toLocaleDateString()
          : "—"}
      </p>
    </div>
  );
}
