import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth.store";
import { useCommentStore } from "@/store/comment.store";

interface Props {
  caseId: number;
}

export default function CommentsTab({ caseId }: Props) {
  const { user } = useAuthStore();
  const isAdmin = user?.role === "ADMIN"

  const {
    comments,
    loading,
    fetchComments,
    createComment,
    deleteComment,
  } = useCommentStore();

  const [content, setContent] = useState("");
  const [sensitivityLevel, setSensitivityLevel] = useState("LOW");

  useEffect(() => {
    fetchComments(caseId);
  }, [caseId, fetchComments]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;

    await createComment(caseId, {
      content,
      sensitivityLevel,
    });

    setContent("");
    setSensitivityLevel("LOW");
  }

  async function handleDelete(id: number) {
    await deleteComment(id);
  }

return (
  <div className="space-y-6 sm:space-y-8">

    {/* Header */}
    <div className="space-y-1 px-1 sm:px-0">
      <h2 className="text-lg font-semibold text-slate-900">
        Internal Case Notes
      </h2>
      <p className="text-xs text-slate-500 leading-relaxed">
        Clearance-based internal discussion. Visibility depends on sensitivity level.
      </p>
    </div>

    {/* Create Comment */}
    <form
      onSubmit={handleSubmit}
      className="bg-white border rounded-2xl p-4 sm:p-6 shadow-sm space-y-4 sm:space-y-5"
    >
      <textarea
        required
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write a case note..."
        rows={4}
        className="w-full border rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-slate-900"
      />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <select
          value={sensitivityLevel}
          onChange={(e) => setSensitivityLevel(e.target.value)}
          className="border rounded-xl px-3 py-2 text-sm bg-white w-full sm:w-auto"
        >
          <option value="LOW">LOW</option>
          <option value="MEDIUM">MEDIUM</option>
          <option value="HIGH">HIGH</option>
          <option value="CRITICAL">CRITICAL</option>
        </select>

        <button
          type="submit"
          className="bg-slate-900 text-white px-5 py-2 rounded-xl text-sm hover:bg-slate-800 transition w-full sm:w-auto"
        >
          Add Note
        </button>
      </div>
    </form>

    {/* Loading */}
   {/* Loading Skeleton */}
{loading && (
  <div className="space-y-4">

    {/* Create Comment Skeleton */}
    <div className="bg-white border rounded-2xl p-4 sm:p-6 shadow-sm space-y-4 animate-pulse">
      <div className="h-20 bg-slate-200 rounded-xl" />
      <div className="flex gap-4">
        <div className="h-9 w-28 bg-slate-200 rounded-xl" />
        <div className="h-9 w-32 bg-slate-200 rounded-xl ml-auto" />
      </div>
    </div>

    {/* Comment Card Skeletons */}
    {[...Array(3)].map((_, i) => (
      <div
        key={i}
        className="bg-white border rounded-2xl p-4 sm:p-6 shadow-sm space-y-3 animate-pulse"
      >
        <div className="flex justify-between">
          <div className="h-4 w-40 bg-slate-200 rounded" />
          <div className="h-4 w-16 bg-slate-200 rounded" />
        </div>

        <div className="space-y-2">
          <div className="h-3 w-full bg-slate-200 rounded" />
          <div className="h-3 w-5/6 bg-slate-200 rounded" />
          <div className="h-3 w-2/3 bg-slate-200 rounded" />
        </div>

        <div className="h-3 w-32 bg-slate-200 rounded" />
      </div>
    ))}
  </div>
)}

    {/* Empty State */}
    {!loading && comments.length === 0 && (
      <div className="bg-white border rounded-2xl p-4 sm:p-6 text-sm text-slate-500">
        No internal notes yet.
      </div>
    )}

    {/* Comment List */}
    {!loading && comments.length > 0 && (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div
          key={comment.id}
          className="bg-white border rounded-2xl p-4 sm:p-6 shadow-sm"
        >
          <div className="flex justify-between items-start gap-4">

            <div className="space-y-2 text-sm flex-1">

              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                <span className="font-medium text-slate-900">
                  {comment.authorEmail}
                </span>

                <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-600">
                  {comment.sensitivityLevel}
                </span>
              </div>

              <div className="text-slate-700 whitespace-pre-wrap break-words">
                {comment.content}
              </div>

              <div className="text-xs text-slate-500 pt-1">
                {new Date(comment.createdAt).toLocaleString()}
              </div>
            </div>

            {isAdmin && (
              <button
                onClick={() => handleDelete(comment.id)}
                className="text-red-600 text-xs hover:text-red-800 shrink-0"
              >
                Delete
              </button>
            )}

          </div>
        </div>
      ))}
    </div>
    )}
  </div>
);
}
