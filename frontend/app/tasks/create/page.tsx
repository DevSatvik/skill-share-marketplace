"use client";

import { useState } from "react";
import type { FC, FormEvent, ChangeEvent, JSX } from "react";
import { useRouter } from "next/navigation";
import { useAxios } from "@/app/hooks/useAxios";
import { useAuth } from "@/app/context/authContext";
import { CreateTaskPayload } from "@/app/types/tasks";

const CreateTaskPage: FC = (): JSX.Element => {
  const router = useRouter();
  const axios = useAxios();
  const { role } = useAuth();

  const [formData, setFormData] = useState<CreateTaskPayload>({
    category: "GARDENING",
    taskName: "",
    taskDescription: "",
    expectedStartDate: "",
    expectedHours: 0,
    hourlyRate: 0,
    currency: "USD",
  });

  const [error, setError] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const payload = formData;

    try {
      await axios.post("/tasks", payload);
      router.push("/tasks/my-posted");
    } catch (err) {
      console.error("Create Task error:", err);
      setError(err.response?.data?.error || "Failed to create task");
    }
  };

  if (role !== "USER") {
    return (
      <main className="flex items-center justify-center min-h-screen bg-gray-50 p-6">
        <div className="w-full max-w-md">
          <p className="text-center text-red-500 text-lg">
            You can only access this page as a User.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Create Task
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
              <label htmlFor="taskName" className="block text-sm font-medium text-gray-700 mb-1">
                Task Name
              </label>
              <input
                id="taskName"
                type="text"
                name="taskName"
                value={formData.taskName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="taskDescription" className="block text-sm font-medium text-gray-700 mb-1">
                Task Description
              </label>
              <textarea
                id="taskDescription"
                name="taskDescription"
                value={formData.taskDescription}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
              />
            </div>
            <div>
              <label htmlFor="expectedStartDate" className="block text-sm font-medium text-gray-700 mb-1">
                Expected Start Date
              </label>
              <input
                id="expectedStartDate"
                type="date"
                name="expectedStartDate"
                value={formData.expectedStartDate}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="expectedHours" className="block text-sm font-medium text-gray-700 mb-1">
                Expected Hours
              </label>
              <input
                id="expectedHours"
                type="number"
                name="expectedHours"
                value={formData.expectedHours}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
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
            {error && <p className="text-sm text-red-500 text-center">{error}</p>}
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
            >
              Create Task
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}