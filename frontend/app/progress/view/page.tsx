// app/progress/view/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAxios } from "@/app/hooks/useAxios";
import { useAuth } from "@/app/context/authContext";

export default function ViewProgressPage() {
  const searchParams = useSearchParams();
  const taskId = searchParams.get("id");

  const axios = useAxios();
  const { authToken } = useAuth();

  const [progressEntries, setProgressEntries] = useState<any[]>([]);
  const [error, setError] = useState("");

  const fetchProgress = async () => {
    try {
      const response = await axios.get(`/tasks/${taskId}/progress`);
      setProgressEntries(response.data.progress || []);
    } catch (err) {
      console.error("Fetch Progress error:", err);
      setError(err.response?.data?.error || "Failed to load progress");
    }
  };

  useEffect(() => {
    if (!authToken || !taskId) return;
    fetchProgress();
  }, [authToken, axios, taskId]);

  if (!taskId) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-gray-50 p-6">
        <div className="text-red-500 text-xl">No task ID provided!</div>
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
        Progress for Task #{taskId}
      </h1>

      {error && (
        <p className="text-red-500 mb-4 text-center">{error}</p>
      )}

      {progressEntries.length === 0 ? (
        <p className="text-gray-700 text-center">No progress entries yet.</p>
      ) : (
        <div className="w-full max-w-2xl space-y-4">
          {progressEntries.map((entry) => (
            <div
              key={entry.id}
              className="bg-white p-4 rounded-lg shadow text-gray-800"
            >
              <p className="text-sm text-gray-500 mb-1">
                {new Date(entry.timestamp).toLocaleString()}
              </p>
              <p>{entry.progressDescription}</p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
