import { useEffect, useMemo, useState } from "react";
import { useDocumentStore } from "@/store/document.store";
import DocumentGroup from "../documents/DocumentGroup";

interface Props {
  caseId: number;
}

export default function DocumentsTab({ caseId }: Props) {

  const {
    documents,
    fetchDocuments,
    deleteDocument,
    uploadDocument,
    loading,
    error,
  } = useDocumentStore();

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchDocuments(caseId);
  }, [caseId, fetchDocuments]);

  const grouped = useMemo(() => {
    const map: Record<string, typeof documents> = {};

    documents.forEach((doc) => {
      const groupKey = doc.documentGroupId ?? `single-${doc.id}`;

      if (!map[groupKey]) {
        map[groupKey] = [];
      }

      map[groupKey].push(doc);
    });

    Object.values(map).forEach((group) =>
      group.sort((a, b) => b.version - a.version)
    );

    return map;
  }, [documents]);

  async function handleUpload(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    if (!e.target.files) return;

    const file = e.target.files[0];

    try {
      setUploading(true);
      await uploadDocument(caseId, file, "LOW");
      e.target.value = ""; // reset input
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-slate-900">
          Documents
        </h2>

        <label className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm cursor-pointer hover:bg-slate-800 transition">
          {uploading ? "Uploading..." : "Upload Document"}
          <input
            type="file"
            hidden
            onChange={handleUpload}
          />
        </label>
      </div>

      {/* ERROR */}
      {error && (
        <div className="text-sm text-red-600">
          {error}
        </div>
      )}

      {/* LOADING */}
      {loading && (
        <div className="text-sm text-slate-500">
          Loading documents...
        </div>
      )}

      {/* EMPTY */}
      {!loading && documents.length === 0 && (
        <div className="bg-white border rounded-2xl p-8 text-center text-sm text-slate-500">
          No documents uploaded for this case.
        </div>
      )}

      {/* GROUPED DOCUMENTS */}
      <div className="space-y-6">
        {Object.entries(grouped).map(([groupId, groupDocs]) => (
          <DocumentGroup
            key={groupId}
            groupId={groupId}
            documents={groupDocs}
            caseId={caseId}
            onDelete={(id) =>
              deleteDocument(caseId, id)
            }
          />
        ))}
      </div>
    </div>
  );
}
