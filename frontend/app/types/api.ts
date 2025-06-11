export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  authToken: string;
}
