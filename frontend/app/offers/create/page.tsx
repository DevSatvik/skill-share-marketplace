"use client";

import type { FC, FormEvent, JSX } from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAxios } from "@/app/hooks/useAxios";
import { useAuth } from "@/app/context/authContext";
import { Task, GetOpenTasksResponse } from "@/app/types/tasks";
import { Offer, GetMyOffersResponse } from "@/app/types/offers";

const CreateOfferPage: FC = (): JSX.Element => {
  const router = useRouter();
  const { authToken, role } = useAuth();
  const axios = useAxios();

  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [myOffers, setMyOffers] = useState<Offer[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!authToken) return;
    const fetchTasks = async (): Promise<void> => {
      try {
        const [tasksResponse, offersResponse] = await Promise.all([
        // const response = await axios.get("/tasks/open");
        axios.get<GetOpenTasksResponse>("/tasks/open"),
          axios.get<GetMyOffersResponse>("/offers/made-by-me"),
        // setTasks(response.data.tasks || []);
        ]);

        setAllTasks(tasksResponse.data.tasks || []);
        setMyOffers(offersResponse.data.offers || []);
      } catch (err) {
        console.error("Fetch tasks error:", err);
        setError("Failed to fetch tasks");
      }
    };

    fetchTasks();
  }, [authToken, axios]);

  const offeredTaskIds = new Set<number>(myOffers.map((offer) => offer.taskId));
  const availableTasks = allTasks.filter((task) => !offeredTaskIds.has(task.id));

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError("");

    try {
      await axios.post("/offers", {
        taskId: parseInt(selectedTaskId),
      });

      router.push("/profile");
    } catch (err) {
      console.error("Create Offer error:", err);
      setError(err.response?.data?.error || "Failed to create offer");
    }
  };

  return (
    role === "PROVIDER" ? (
      <main className="flex items-center justify-center min-h-screen bg-gray-50 p-6">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              Make Offer
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="task" className="block text-sm font-medium text-gray-700 mb-1">
                  Select Task
                </label>
                <select
                  id="task"
                  value={selectedTaskId}
                  onChange={(e) => setSelectedTaskId(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Select Task --</option>
                  {availableTasks.map((task) => (
                    <option key={task.id} value={task.id}>
                      {task.taskName} (#{task.id})
                    </option>
                  ))}
                </select>
              </div>

              {error && <p className="text-sm text-red-500 text-center">{error}</p>}

              <button
                type="submit"
                className="w-full py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition"
              >
                Submit Offer
              </button>
            </form>
          </div>
        </div>
      </main>
    ) : (
      <main className="flex items-center justify-center min-h-screen bg-gray-50 p-6">
        <div className="w-full max-w-md">
          <p className="text-center text-red-500 text-lg">
            You can only access this page as a Provider.
          </p>
        </div>
      </main>
    )
  );
}
