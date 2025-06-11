"use client";

import { useState, useEffect } from "react";
import type {FC, JSX } from "react";
import { useAxios } from "@/app/hooks/useAxios";
import { useAuth } from "@/app/context/authContext";
import type { Offer, GetOffersOnUserTasksResponse } from "@/app/types/offers";
import type { Role } from "@/app/types/auth";

const ManageOffersPage: FC = (): JSX.Element => {
  const { authToken, role } = useAuth();
  const axios = useAxios();

  const [offers, setOffers] = useState<Offer[]>([]);
  const [error, setError] = useState<string>("");

  const fetchOffers = async (): Promise<void> => {
    try {
      const response = await axios.get<GetOffersOnUserTasksResponse>
      ("/tasks/user/posted/offers");
      setOffers(response.data.offers || []);
    } catch (err) {
      console.error("Fetch Offers error:", err);
      setError("Failed to load offers");
    }
  };

  useEffect(() => {
    if (!authToken) return;
    fetchOffers();
  }, [authToken, axios]);

  const handleRespond = async (offerId: number, action: string) => {
    try {
      await axios.post(`/offers/${offerId}/${action.toLowerCase()}`);
      fetchOffers();
    } catch (err) {
      console.error(`Offer ${action} error:`, err);
      setError(`Failed to ${action.toLowerCase()} offer`);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-50 p-6">
      {role === "USER" ? (
        <div className="w-full max-w-3xl">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Manage Offers
          </h1>

          {error && (
            <p className="text-sm text-red-500 mb-4 text-center">
              {error}
            </p>
          )}

          {offers.length === 0 ? (
            <p className="text-gray-700 text-center">No offers on your tasks.</p>
          ) : (
            <div className="space-y-4">
              {offers.map((offer) => (
                <div
                  key={offer.offerId}
                  className="bg-white p-6 rounded-lg shadow-md"
                >
                  <div className="space-y-2 text-gray-800">
                    <p>
                      <strong>Task:</strong> {offer.taskName} (#{offer.taskId})
                    </p>
                    <p>
                      <strong>Provider:</strong> {offer.providerName}
                    </p>
                    <p>
                      <strong>Status:</strong> {offer.status}
                    </p>
                  </div>

                  {offer.status === "PENDING" && (
                    <div className="flex space-x-4 mt-4 justify-end">
                      <button
                        onClick={() => handleRespond(offer.offerId, "ACCEPT")}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg transition hover:bg-green-700"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleRespond(offer.offerId, "REJECT")}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg transition hover:bg-red-700"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="w-full max-w-md text-center">
          <p className="text-red-500 text-lg">
            You can only access this page as a User.
          </p>
        </div>
      )}
    </main>
  );
}

export default ManageOffersPage;