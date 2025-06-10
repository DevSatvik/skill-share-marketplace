"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useAxios } from "@/app/hooks/useAxios";
import { useAuth } from "@/app/context/authContext";

export default function AddProgressPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const taskId = searchParams.get("id");

  const { authToken } = useAuth();
  const axios = useAxios();

  const [progressDescription, setProgressDescription] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await axios.post(`/tasks/${taskId}/progress`, { progressDescription });
      router.push("/tasks/my-accepted");
    } catch (err: any) {
      console.error("Add Progress error:", err);
      setError(err.response?.data?.error || "Failed to add progress");
    }
  };

  if (!taskId)
    return (
      <main className="flex items-center justify-center min-h-screen bg-gray-50 p-6">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-8">
            <h1 className="text-xl font-semibold text-red-500 text-center">
              No task ID provided!
            </h1>
          </div>
        </div>
      </main>
    );

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Add Progress to Task #{taskId}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="progress" className="block text-sm font-medium text-gray-700 mb-1">
                Progress Description
              </label>
              <textarea
                id="progress"
                value={progressDescription}
                onChange={(e) => setProgressDescription(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
              />
            </div>

            {error && <p className="text-sm text-red-500 text-center">{error}</p>}

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
            >
              Submit Progress
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
