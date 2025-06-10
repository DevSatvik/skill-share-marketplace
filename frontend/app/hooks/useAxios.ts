import axiosInstance from "@/app/lib/axios"
import { useAuth } from "@/app/context/authContext";

export const useAxios = () => {
  const { authToken } = useAuth();

  const authAxios = axiosInstance;

  if (authToken) {
    authAxios.defaults.headers.common["Authorization"] = `Bearer ${authToken}`;
  } else {
    delete authAxios.defaults.headers.common["Authorization"];
  }

  return authAxios;
};