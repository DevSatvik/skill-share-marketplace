"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAxios } from "@/app/hooks/useAxios";

export default function CreateSkillPage() {
  const router = useRouter();
  const axios = useAxios();

  const [formData, setFormData] = useState({
    category: "GARDENING",
    experienceYears: "",
    workNature: "ONSITE",
    hourlyRate: "",
    currency: "USD",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await axios.post("/skills", {
        ...formData,
        experienceYears: parseInt(formData.experienceYears, 10),
        hourlyRate: parseFloat(formData.hourlyRate),
      });
      router.push("/profile");
    } catch (err) {
      console.error("Create Skill error:", err);
      setError(err.response?.data?.error || "Failed to create skill");
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Create Skill
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="GARDENING">Gardening</option>
                <option value="CLEANING">Cleaning</option>
                <option value="TUTORING">Tutoring</option>
              </select>
            </div>

            <div>
              <label htmlFor="experienceYears" className="block text-sm font-medium text-gray-700 mb-1">
                Experience (Years)
              </label>
              <input
                id="experienceYears"
                type="number"
                name="experienceYears"
                value={formData.experienceYears}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="workNature" className="block text-sm font-medium text-gray-700 mb-1">
                Nature of Work
              </label>
              <select
                id="workNature"
                name="workNature"
                value={formData.workNature}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ONSITE">Onsite</option>
                <option value="ONLINE">Online</option>
              </select>
            </div>

            <div>
              <label htmlFor="hourlyRate" className="block text-sm font-medium text-gray-700 mb-1">
                Hourly Rate
              </label>
              <input
                id="hourlyRate"
                type="number"
                step="0.01"
                name="hourlyRate"
                value={formData.hourlyRate}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">
                Currency
              </label>
              <select
                id="currency"
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="USD">USD</option>
                <option value="AUD">AUD</option>
                <option value="SGD">SGD</option>
                <option value="INR">INR</option>
              </select>
            </div>

            {error && (
              <p className="text-sm text-red-500 text-center">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
            >
              Create Skill
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}