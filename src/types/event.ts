export interface CaseEvent {
  id: number;
  eventType: string;
  description: string;
  eventDate: string;
  nextDate?: string | null;
  createdBy: string;
  createdAt: string;
}

export interface CreateCaseEventRequest {
  eventType: string;
  description: string;
  eventDate: string;
  nextDate?: string | null;
}
