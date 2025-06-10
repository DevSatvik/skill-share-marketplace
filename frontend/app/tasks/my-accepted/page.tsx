// app/tasks/my-accepted/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useAxios } from "@/app/hooks/useAxios";
import { useAuth } from "@/app/context/authContext";
import { useRouter } from "next/navigation";

export default function MyTasksPage() {
  const { authToken, role } = useAuth();
  const axios = useAxios();
  const router = useRouter();

  const [tasks, setTasks] = useState<any[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authToken || role !== "PROVIDER") return;
    fetchMyTasks();
  }, [authToken, axios, role]);

  const fetchMyTasks = async () => {
    try {
      const response = await axios.get("/tasks/provider/accepted");
      setTasks(response.data.tasks || []);
    } catch (err) {
      console.error("Fetch My Tasks error:", err);
      setError("Failed to load tasks");
    }
  };

  // Access control for providers
  if (role !== "PROVIDER") {
    return (
      <main className="flex items-center justify-center min-h-screen bg-gray-50 p-6">
        <div className="w-full max-w-md text-center">
          <p className="text-lg text-red-500">
            You can only access this page as a Provider.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="w-full max-w-3xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          My Tasks
        </h1>

        {error && (
          <p className="text-sm text-red-500 mb-4 text-center">{error}</p>
        )}

        {tasks.length === 0 ? (
          <p className="text-gray-700 text-center">You have no tasks.</p>
        ) : (
          <div className="space-y-6">
            {tasks.map((task) => (
              <div key={task.id} className="bg-white p-6 rounded-lg shadow-md">
                <div className="space-y-1 text-gray-800">
                  <p>
                    <strong>Task:</strong> {task.taskName} (#{task.id})
                  </p>
                  <p>
                    <strong>Category:</strong> {task.category}
                  </p>
                  <p>
                    <strong>Completed:</strong> {task.completed ? "Yes" : "No"}
                  </p>
                  <p>
                    <strong>Provider Marked Complete:</strong>{" "}
                    {task.providerMarkedComplete ? "Yes" : "No"}
                  </p>
                  <p>
                    <strong>User Accepted Completion:</strong>{" "}
                    {task.userAcceptedCompletion == null
                      ? "Pending"
                      : task.userAcceptedCompletion
                      ? "Accepted"
                      : "Rejected"}
                  </p>
                </div>

                {/* Action buttons */}
                <div className="flex flex-wrap gap-4 mt-4 justify-end">
                  {/* Provider marks complete */}
                  {!task.completed && !task.providerMarkedComplete && (
                    <button
                      onClick={async () => {
                        try {
                          await axios.post(
                            `/tasks/${task.id}/provider-complete`
                          );
                          fetchMyTasks();
                        } catch (err) {
                          console.error("Provider Mark Complete error:", err);
                          setError("Failed to mark complete");
                        }
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition"
                    >
                      Mark as Complete
                    </button>
                  )}

                  {/* Provider adds progress */}
                  <button
                    onClick={() => router.push(`/progress/add?id=${task.id}`)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
                  >
                    Add Progress
                  </button>

                  <button
                    onClick={() => router.push(`/progress/view?id=${task.id}`)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
                  >
                    View Progress
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
