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
  };
}

export async function register(data: RegisterRequest): Promise<AuthResponse> {
  const res = await api.post("/auth/register", data);
  return res.data;
}

export async function login(data: LoginRequest): Promise<AuthResponse> {
  const res = await api.post("/auth/login", data);
  return res.data;
}
