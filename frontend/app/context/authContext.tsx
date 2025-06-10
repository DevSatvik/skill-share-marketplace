"use client";

import { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "@/app/lib/axios"; // Adjust the import based on your axios setup

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(null);
  const [role, setRole] = useState(null); 

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setAuthToken(token);

      // Fetch profile once to get role
      axiosInstance
        .get("/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setRole(res.data.user.role); // Save role in context
        })
        .catch((err) => {
          console.error("Failed to fetch profile", err);
          setRole(null);
        });
    }
  }, []);

  const login = (token) => {
    localStorage.setItem("authToken", token);
    setAuthToken(token);

    // Fetch role immediately after login
    axiosInstance
      .get("/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setRole(res.data.user.role);
      })
      .catch((err) => {
        console.error("Failed to fetch profile", err);
        setRole(null);
      });


  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setAuthToken(null);
    setRole(null); 
  };

  return (
    <AuthContext.Provider value={{ authToken, login, logout, role }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
