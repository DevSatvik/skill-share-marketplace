"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAxios } from "@/app/hooks/useAxios";
import { useAuth } from "@/app/context/authContext";

export default function UpdateTaskPage() {
  const router = useRouter();
  const params = useParams();
  const taskId = params.id

  const axios = useAxios();
  const { authToken, role } = useAuth();

  const [formData, setFormData] = useState<any>({
    category: "GARDENING",
    taskName: "",
    taskDescription: "",
    expectedStartDate: "",
    expectedHours: "",
    hourlyRate: "",
    currency: "USD",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    if (!authToken || !taskId) return;

    const fetchTask = async () => {
      try {
        const response = await axios.get(`/tasks/user/posted`);
        const task = response.data.tasks.find((t: any) => t.id === parseInt(taskId!));
        if (task) {
          setFormData({
            category: task.category,
            taskName: task.taskName,
            taskDescription: task.taskDescription,
            expectedStartDate: task.expectedStartDate.split("T")[0], // date only
            expectedHours: task.expectedHours,
            hourlyRate: task.hourlyRate,
            currency: task.currency,
          });
        } else {
          setError("Task not found");
        }
      } catch (err) {
        console.error("Fetch Task error:", err);
        setError("Failed to load task");
      }
    };

    fetchTask();
  }, [authToken, axios, taskId]);

  const handleChange = (e: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");

    try {
      await axios.patch(`/tasks/${taskId}`, {
        ...formData,
        expectedStartDate: new Date(formData.expectedStartDate),
        expectedHours: parseInt(formData.expectedHours),
        hourlyRate: parseFloat(formData.hourlyRate),
      });

      router.push("/tasks/my-posted");
    } catch (err) {
      console.error("Update Task error:", err);
      setError(err.response?.data?.error || "Failed to update task");
    }
  };

  if (!taskId) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-gray-50 p-6">
        <div className="text-red-500 text-xl">No task ID provided!</div>
      </main>
    );
  }

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Update Task #{taskId}
        </h1>

        {error && (
          <p className="text-red-500 mb-4 text-center">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label>Category:</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="border p-2 w-full"
            >
              <option value="GARDENING">GARDENING</option>
              <option value="CLEANING">CLEANING</option>
              <option value="TUTORING">TUTORING</option>
            </select>
          </div>

          <div>
            <label>Task Name:</label>
            <input
              type="text"
              name="taskName"
              value={formData.taskName}
              onChange={handleChange}
              required
              className="border p-2 w-full"
            />
          </div>

          <div>
            <label>Task Description:</label>
            <textarea
              name="taskDescription"
              value={formData.taskDescription}
              onChange={handleChange}
              required
              className="border p-2 w-full"
            ></textarea>
          </div>

          <div>
            <label>Expected Start Date:</label>
            <input
              type="date"
              name="expectedStartDate"
              value={formData.expectedStartDate}
              onChange={handleChange}
              required
              className="border p-2 w-full"
            />
          </div>

          <div>
            <label>Expected Hours:</label>
            <input
              type="number"
              name="expectedHours"
              value={formData.expectedHours}
              onChange={handleChange}
              required
              className="border p-2 w-full"
            />
          </div>

          <div>
            <label>Hourly Rate:</label>
            <input
              type="number"
              step="0.01"
              name="hourlyRate"
              value={formData.hourlyRate}
              onChange={handleChange}
              required
              className="border p-2 w-full"
            />
          </div>

          <div>
            <label>Currency:</label>
            <select
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              className="border p-2 w-full"
            >
              <option value="USD">USD</option>
              <option value="AUD">AUD</option>
              <option value="SGD">SGD</option>
              <option value="INR">INR</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition"
          >
            Update Task
          </button>
        </form>
      </div>
    </main>
  );
}
