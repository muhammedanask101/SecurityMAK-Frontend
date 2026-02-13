import api from "./axios";

export interface RegisterRequest {
  email: string;
  password: string;
  organizationName: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    role: string;
    tenantId: string | null;
    organizationName: string;
    clearanceLevel: string;
  };
}

export async function register(data: RegisterRequest): Promise<AuthResponse> {
  const res = await api.post("/api/auth/register", data);
  return res.data;
}

export async function login(data: LoginRequest): Promise<AuthResponse> {
  const res = await api.post("/api/auth/login", data);
  return res.data;
}
