import api from "./axios";
import type { AuditPageResponse } from "@/types/audit";

interface AuditFilters {
  page?: number;
  size?: number;
  actorEmail?: string;
  action?: string;
  targetType?: string;
  from?: string;
  to?: string;
}

export const auditApi = {
  async getAuditLogs(filters: AuditFilters) {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, String(value));
    });

    const res = await api.get<AuditPageResponse>(
      `/api/admin/audit-logs?${params.toString()}`
    );

    return res.data;
  },
};
