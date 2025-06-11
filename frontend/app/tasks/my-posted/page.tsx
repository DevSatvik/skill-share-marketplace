// app/tasks/my-posted/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useAxios } from "@/app/hooks/useAxios";
import { useAuth } from "@/app/context/authContext";
import { useRouter } from "next/navigation";

export default function MyPostedTasksPage() {
  const { authToken, role } = useAuth();
  const axios = useAxios();
  const router = useRouter();

  const [tasks, setTasks] = useState<any[]>([]);
  const [error, setError] = useState("");

  //   function handleMarkComplete(taskId: number) {
  //   try {
  //     axios.post(`/tasks/${taskId}/complete\``).then(fetchMyPostedTasks);
  //   } catch (err) {
  //     console.error("Mark Complete error:", err);
  //     setError("Failed to mark task as complete");
  //   }
  // }

  function handleUpdateTask(taskId: number) {
    router.push(`/tasks/update/${taskId}`);

  }

  // function handleViewOffers(taskId: number) {
  //   router.push("/offers/manage");
  // }

  const fetchMyPostedTasks = async () => {
    try {
      const response = await axios.get("/tasks/user/posted");
      setTasks(response.data.tasks || []);
    } catch (err) {
      console.error("Fetch My Posted Tasks error:", err);
      setError("Failed to load tasks");
    }
  };

  useEffect(() => {
    if (!authToken || role !== "USER") return;
    fetchMyPostedTasks();
  }, [authToken, axios, role]);

  // Access control
  if (role !== "USER") {
    return (
      <main className="flex items-center justify-center min-h-screen bg-gray-50 p-6">
        <div className="w-full max-w-md text-center">
          <p className="text-lg text-red-500">
            You can only access this page as a User.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="w-full max-w-3xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          My Posted Tasks
        </h1>

        {error && (
          <p className="text-sm text-red-500 mb-4 text-center">{error}</p>
        )}

        {tasks.length === 0 ? (
          <p className="text-gray-700 text-center">
            You have not posted any tasks.
          </p>
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

                <div className="flex flex-wrap gap-4 mt-4 justify-end">
                  {!task.completed && (
                    <>
                      {/* If Provider has marked complete → show Accept / Reject buttons */}
                      {task.providerMarkedComplete &&
                      task.userAcceptedCompletion == null ? (
                        <>
                          <button
                            onClick={async () => {
                              try {
                                await axios.post(
                                  `/tasks/${task.id}/accept-completion`
                                );
                                fetchMyPostedTasks();
                              } catch (err) {
                                console.error("Accept Completion error:", err);
                                setError("Failed to accept completion");
                              }
                            }}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition"
                          >
                            Accept Completion
                          </button>

                          <button
                            onClick={async () => {
                              try {
                                await axios.post(
                                  `/tasks/${task.id}/reject-completion`
                                );
                                fetchMyPostedTasks();
                              } catch (err) {
                                console.error("Reject Completion error:", err);
                                setError("Failed to reject completion");
                              }
                            }}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition"
                          >
                            Reject Completion
                          </button>
                        </>
                      ) : (
                        <>
                          {/* Default User buttons → Mark Complete, Update, View Offers
                          <button
                            onClick={() => {
                              handleMarkComplete(task.id);
                            }}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition"
                          >
                            Mark Complete
                          </button> */}
                          <button
                            onClick={() => handleUpdateTask(task.id)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
                          >
                            Update Task
                          </button>
                          {/* <button
                            onClick={() => handleViewOffers(task.id)}
                            className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition"
                          >
                            View Offers
                          </button> */}

                          <button
                            onClick={() =>
                              router.push(`/progress/view?id=${task.id}`)
                            }
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
                          >
                            View Progress
                          </button>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
