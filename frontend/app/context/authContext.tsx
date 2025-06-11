// authContext.tsx
import type { ReactNode, FC } from "react";
import { createContext, useContext, useState, useEffect } from "react";
import type { MeResponse, Role } from "../types/auth";
import axiosInstance from "@/app/lib/axios";

interface AuthContextType {
  authToken: string | null;
  role: Role | null;
  login: (token: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [role, setRole]         = useState<Role | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    setAuthToken(token);
    axiosInstance
      .get<MeResponse>("/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setRole(res.data.user.role))
      .catch(() => setRole(null));
  }, []);

  const login = async (token: string): Promise<void> => {
    localStorage.setItem("authToken", token);
    setAuthToken(token);

    try {
      const res = await axiosInstance.get<MeResponse>("/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRole(res.data.user.role);
    } catch {
      setRole(null);
    }
  };

  const logout = (): void => {
    localStorage.removeItem("authToken");
    setAuthToken(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ authToken, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};
