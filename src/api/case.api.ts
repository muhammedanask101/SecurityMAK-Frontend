import api from "./axios";
import type { CaseDto } from "../types/case";

export async function getCases(): Promise<CaseDto[]> {
  const res = await api.get("/cases");
  return res.data;
}

export async function getCaseById(id: number) {
  const res = await api.get(`/cases/${id}`);
  return res.data;
}

export async function updateCaseStatus(
  id: number,
  newStatus: string
) {
  const res = await api.patch(`/cases/${id}/status`, {
    status: newStatus,
  });

  return res.data;
}