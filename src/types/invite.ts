export type InviteStatus =
  | "PENDING"
  | "REGISTERED"
  | "APPROVED"
  | "REJECTED"
  | "TERMINATED";

export interface InviteView {
  id: number;
  email: string;
  token: string;   
  role: string;
  clearanceLevel: string;
  status: InviteStatus;
  createdBy: string;
  createdAt: string;
  registeredAt?: string;
  approvedAt?: string;
  terminatedAt?: string;
}
