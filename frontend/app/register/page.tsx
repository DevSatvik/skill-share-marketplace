"use client";

import { useState } from "react";
import type { FC, FormEvent, ChangeEvent, JSX } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "../lib/axios";
import { useAuth } from "../context/authContext";

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    role: "USER",
    email: "",
    password: "",
    mobileNumber: "",
    type: "INDIVIDUAL",
    firstName: "",
    lastName: "",
    companyName: "",
    companyPhoneNumber: "",
    taxID: "",
    repFirstName: "",
    repLastName: "",
    addressStreetNumber: "",
    addressStreetName: "",
    addressCitySuburb: "",
    addressState: "",
    addressPostcode: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e : ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axiosInstance.post("/register", formData);
      login(response.data.authToken);
      router.push("/profile");
    } catch (err) {
      console.error("Register error:", err);
      setError(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Register
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="USER">User</option>
                <option value="PROVIDER">Provider</option>
              </select>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Mobile Number
              </label>
              <input
                id="mobileNumber"
                type="text"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                Account Type
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="INDIVIDUAL">Individual</option>
                <option value="COMPANY">Company</option>
              </select>
            </div>

            {formData.type === "INDIVIDUAL" ? (
              <>
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="addressStreetNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Street Number
                  </label>
                  <input
                    id="addressStreetNumber"
                    type="text"
                    name="addressStreetNumber"
                    value={formData.addressStreetNumber}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="addressStreetName" className="block text-sm font-medium text-gray-700 mb-1">
                    Street Name
                  </label>
                  <input
                    id="addressStreetName"
                    type="text"
                    name="addressStreetName"
                    value={formData.addressStreetName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="addressCitySuburb" className="block text-sm font-medium text-gray-700 mb-1">
                    City/Suburb
                  </label>
                  <input
                    id="addressCitySuburb"
                    type="text"
                    name="addressCitySuburb"
                    value={formData.addressCitySuburb}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="addressState" className="block text-sm font-medium text-gray-700 mb-1">
                    State
                  </label>
                  <input
                    id="addressState"
                    type="text"
                    name="addressState"
                    value={formData.addressState}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="addressPostcode" className="block text-sm font-medium text-gray-700 mb-1">
                    Postcode
                  </label>
                  <input
                    id="addressPostcode"
                    type="text"
                    name="addressPostcode"
                    value={formData.addressPostcode}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
                    Company Name
                  </label>
                  <input
                    id="companyName"
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="companyPhoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Company Phone Number
                  </label>
                  <input
                    id="companyPhoneNumber"
                    type="text"
                    name="companyPhoneNumber"
                    value={formData.companyPhoneNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="taxID" className="block text-sm font-medium text-gray-700 mb-1">
                    Tax ID
                  </label>
                  <input
                    id="taxID"
                    type="text"
                    name="taxID"
                    value={formData.taxID}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3	border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="repFirstName" className="block text-sm	font-medium text-gray-700 mb-1">
                    Representative First Name
                  </label>
                  <input
                    id="repFirstName"
                    type="text"
                    name="repFirstName"
                    value={formData.repFirstName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3	border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="repLastName" className="block text-sm font-medium text-gray-700 mb-1">
                    Representative Last Name
                  </label>
                  <input
                    id="repLastName"
                    type="text"
                    name="repLastName"
                    value={formData.repLastName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3	border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </>
            )}

            {error && <p className="text-sm text-red-500 text-center">{error}</p>}

            <button
              type="submit"
              className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
            >
              Register
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
