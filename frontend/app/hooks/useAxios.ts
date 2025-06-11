// useAxios.ts
import type { AxiosInstance } from "axios";
import axiosInstance from "@/app/lib/axios";
import { useAuth } from "@/app/context/authContext";

export const useAxios = (): AxiosInstance => {
  const { authToken } = useAuth();

  if (authToken) {
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${authToken}`;
  } else {
    delete axiosInstance.defaults.headers.common["Authorization"];
  }

  return axiosInstance;
};
