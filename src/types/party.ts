export interface CaseParty {
  id: number;
  name: string;
  role: string;
  advocateName?: string;
  contactInfo?: string;
  address?: string;
  notes?: string;
}

export interface CreatePartyRequest {
  name: string;
  role: string;
  advocateName?: string;
  contactInfo?: string;
  address?: string;
  notes?: string;
}
