// app/tasks/update/[id]/page.tsx
"use client";

import type { FC, FormEvent, ChangeEvent, JSX } from "react";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAxios } from "@/app/hooks/useAxios";
import { useAuth } from "@/app/context/authContext";
import type { Task, GetUserPostedTasksResponse, CreateTaskPayload } from "@/app/types/tasks";
import type { Role } from "@/app/types/auth";

const UpdateTaskPage: FC = (): JSX.Element => {
  const router = useRouter();
  const { id: taskId } = useParams() as { id?: string };
  const axios = useAxios();
  const { authToken, role } = useAuth();

  const [formData, setFormData] = useState<CreateTaskPayload>({
    category: "GARDENING",
    taskName: "",
    taskDescription: "",
    expectedStartDate: "",
    expectedHours: 0,
    hourlyRate: 0,
    currency: "USD",
  });
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!authToken || !taskId) return;
    const fetchTask = async (): Promise<void> => {
      try {
        const res = await axios.get<GetUserPostedTasksResponse>("/tasks/user/posted");
        const task = res.data.tasks.find((t: Task) => t.id === parseInt(taskId, 10));
        if (task) {
          setFormData({
            category: task.category,
            taskName: task.taskName,
            taskDescription: task.taskDescription,
            expectedStartDate: task.expectedStartDate.split("T")[0],
            expectedHours: task.expectedHours,
            hourlyRate: task.hourlyRate,
            currency: task.currency,
          });
        } else {
          setError("Task not found");
        }
      } catch (err: unknown) {
        console.error("Fetch Task error:", err);
        setError("Failed to load task");
      }
    };
    fetchTask();
  }, [authToken, axios, taskId]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]:
        name === "expectedHours"
          ? parseInt(value, 10)
          : name === "hourlyRate"
          ? parseFloat(value)
          : value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError("");
    try {
      await axios.patch<void>(`/tasks/${taskId}`, {
        ...formData,
        expectedStartDate: new Date(formData.expectedStartDate),
      });
      router.push("/tasks/my-posted");
    } catch (err: any) {
      console.error("Update Task error:", err);
      setError(err.response?.data?.error ?? "Failed to update task");
    }
  };

  if (!taskId) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-gray-50 p-6">
        <div className="text-red-500 text-xl">No task ID provided!</div>
      </main>
    );
  }

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
            Update Task #{taskId}
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
                name="taskName"
                type="text"
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
                name="expectedStartDate"
                type="date"
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
                name="expectedHours"
                type="number"
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
                name="hourlyRate"
                type="number"
                step="0.01"
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
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
            >
              Update Task
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default UpdateTaskPage;
