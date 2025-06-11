
export type Role = "USER" | "PROVIDER";

export interface MeResponse {
  user: {
    id: string;
    email: string;
    role: Role;
  };
}

export interface LoginResponse {
  authToken: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}
