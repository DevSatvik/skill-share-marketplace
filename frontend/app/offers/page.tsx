"use client";

import { useState, useEffect } from "react";
import { useAxios } from "@/app/hooks/useAxios";
import { useAuth } from "@/app/context/authContext";

export default function OffersPage() {
  const { authToken, role } = useAuth();
  const axios = useAxios();

  const [tasks, setTasks] = useState<any[]>([]);
  const [offers, setOffers] = useState<any[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const fetchTasks = async () => {
    try {
      const response = await axios.get("/tasks/open");
      setTasks(response.data.tasks || []);
    } catch (err) {
      console.error("Fetch Tasks error:", err);
      setError("Failed to load tasks");
    }
  };

  const fetchMyOffers = async () => {
    try {
      const response = await axios.get("/offers/made-by-me");
      setOffers(response.data.offers || []);
    } catch (err) {
      console.error("Fetch My Offers error:", err);
      setError("Failed to load offers");
    }
  };

  useEffect(() => {
    if (!authToken || role !== "PROVIDER") return;
    fetchTasks();
    fetchMyOffers();
  }, [authToken, axios, role]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    try {
      await axios.post("/offers", {
        taskId: parseInt(selectedTaskId),
      });

      setSuccessMessage("Offer submitted successfully");
      setSelectedTaskId("");
      fetchMyOffers();
    } catch (err) {
      console.error("Create Offer error:", err);
      setError(err.response?.data?.error || "Failed to create offer");
    }
  };

  // Access control
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
    <main className="flex flex-col items-center min-h-screen bg-gray-50 p-6 space-y-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
        Offers
      </h1>

      {/* Section 1 → Make Offer */}
      <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-blue-600">
          Make Offer on a Task
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Select Task:</label>
            <select
              value={selectedTaskId}
              onChange={(e) => setSelectedTaskId(e.target.value)}
              required
              className="border p-2 w-full rounded"
            >
              <option value="">-- Select Task --</option>
              {tasks.map((task) => (
                <option key={task.id} value={task.id}>
                  {task.taskName} (#{task.id})
                </option>
              ))}
            </select>
          </div>

          {error && <p className="text-red-500">{error}</p>}
          {successMessage && <p className="text-green-600">{successMessage}</p>}

          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 rounded-lg font-medium hover:bg-purple-700 transition"
          >
            Submit Offer
          </button>
        </form>
      </div>

      {/* Section 2 → My Offers */}
      <div className="w-full max-w-3xl bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-blue-600">
          My Offers
        </h2>

        {offers.length === 0 ? (
          <p className="text-gray-700 text-center">You have not made any offers yet.</p>
        ) : (
          <div className="space-y-4">
            {offers.map((offer: any) => (
              <div
                key={offer.offerId}
                className="border p-4 rounded text-gray-800 space-y-1"
              >
                <p>
                  <strong>Task:</strong> {offer.taskName} (#{offer.taskId})
                </p>
                <p>
                  <strong>Status:</strong> {offer.status}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
