import { useEffect, useState } from "react";
import { caseApi } from "@/api/case.api";
import { useAuthStore } from "@/store/auth.store";
import type {
  CommentResponse,
  SensitivityLevel,
} from "@/types/case";

interface Props {
  caseId: number;
}

export default function CaseComments({ caseId }: Props) {
  const { user } = useAuthStore();
  const isAdmin = user?.role.includes("ADMIN");

  const [comments, setComments] = useState<CommentResponse[]>([]);
  const [content, setContent] = useState("");
  const [sensitivityLevel, setSensitivityLevel] =
    useState<SensitivityLevel>("LOW");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadComments = async () => {
      try {
        const data = await caseApi.getComments(caseId);
        if (!cancelled) {
          setComments(data);
        }
      } catch (error) {
        console.error("Failed to fetch comments", error);
      }
    };

    loadComments();

    return () => {
      cancelled = true;
    };
  }, [caseId]);

  const refreshComments = async () => {
    const data = await caseApi.getComments(caseId);
    setComments(data);
  };

  const handleSubmit = async () => {
    if (!content.trim()) return;

    setLoading(true);

    await caseApi.addComment(
      caseId,
      content,
      sensitivityLevel
    );

    setContent("");
    await refreshComments();

    setLoading(false);
  };

  const handleDelete = async (commentId: number) => {
    if (!isAdmin) return;

    await caseApi.deleteComment(commentId);
    await refreshComments();
  };

  return (
    <div className="space-y-6">
      <h3 className="text-sm font-semibold text-gray-700">
        Comments
      </h3>

      <div className="space-y-3">
        {comments.map((c) => (
          <div
            key={c.id}
            className="border rounded-md p-3 bg-white"
          >
            <div className="flex justify-between items-center">
              <p className="text-xs text-gray-500">
                {c.authorEmail} •{" "}
                {new Date(c.createdAt).toLocaleString()}
              </p>

              {isAdmin && (
                <button
                  onClick={() => handleDelete(c.id)}
                  className="text-xs text-red-600 hover:underline"
                >
                  Delete
                </button>
              )}
            </div>

            <p className="text-sm text-gray-700 mt-2 whitespace-pre-wrap">
              {c.content}
            </p>

            <p className="text-xs text-gray-400 mt-1">
              Sensitivity: {c.sensitivityLevel}
            </p>
          </div>
        ))}
      </div>

      {/* Add Comment */}
      <div className="space-y-3 border rounded-xl p-4 bg-white">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
          placeholder="Add comment..."
          className="w-full border rounded-md px-3 py-2 text-sm"
        />

        <select
          value={sensitivityLevel}
          onChange={(e) =>
            setSensitivityLevel(
              e.target.value as SensitivityLevel
            )
          }
          className="border rounded-md px-3 py-2 text-sm"
        >
          <option value="LOW">LOW</option>
          <option value="MEDIUM">MEDIUM</option>
          <option value="HIGH">HIGH</option>
          <option value="CRITICAL">CRITICAL</option>
        </select>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-4 py-2 bg-gray-900 text-white text-sm rounded-md hover:bg-gray-800 disabled:opacity-50"
        >
          {loading ? "Posting..." : "Post Comment"}
        </button>
      </div>
    </div>
  );
}
