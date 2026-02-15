import { create } from "zustand";
import { commentApi } from "@/api/comment.api";
import type { CaseComment, CreateCommentRequest } from "@/types/comment";

interface CommentState {
  comments: CaseComment[];
  loading: boolean;
  fetchComments: (caseId: number) => Promise<void>;
  createComment: (
    caseId: number,
    payload: CreateCommentRequest
  ) => Promise<void>;
  deleteComment: (id: number) => Promise<void>;
}

export const useCommentStore = create<CommentState>((set, get) => ({
  comments: [],
  loading: false,

  fetchComments: async (caseId) => {
    set({ loading: true });
    const data = await commentApi.list(caseId);
    set({ comments: data, loading: false });
  },

  createComment: async (caseId, payload) => {
    const newComment = await commentApi.create(caseId, payload);
    set({
      comments: [newComment, ...get().comments],
    });
  },

  deleteComment: async (id) => {
    await commentApi.delete(id);
    set({
      comments: get().comments.filter((c) => c.id !== id),
    });
  },
}));
