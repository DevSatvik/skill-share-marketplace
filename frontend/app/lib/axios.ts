// lib/axios.ts
import axios, { type AxiosInstance } from "axios";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: "http://localhost:4000/api",
});

export default axiosInstance;