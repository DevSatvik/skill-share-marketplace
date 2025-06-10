"use client";

import { useAuth } from "@/app/context/authContext";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const { authToken, role } = useAuth();
  const router = useRouter();

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 py-12 px-6">
      <h1 className="text-5xl font-extrabold text-gray-900 mb-6 text-center">
        Welcome to SkillShare Marketplace
      </h1>
      <p className="text-lg text-gray-700 mb-10 text-center max-w-2xl">
        Connect skilled providers with users who need help. Post tasks, make offers, and collaborate!
      </p>

      <div className="flex flex-wrap gap-4 justify-center">
        {!authToken && (
          <>
            <button
              onClick={() => router.push("/login")}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium transition hover:bg-blue-700"
            >
              Login
            </button>
            <button
              onClick={() => router.push("/register")}
              className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium transition hover:bg-green-700"
            >
              Register
            </button>
          </>
        )}

        {authToken && (
          <>
            <button
              onClick={() => router.push("/profile")}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium transition hover:bg-blue-700"
            >
              View Profile
            </button>

            {role === "USER" && (
              <>
                <button
                  onClick={() => router.push("/tasks/create")}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium transition hover:bg-purple-700"
                >
                  Create Task
                </button>
                <button
                  onClick={() => router.push("/tasks/my-posted")}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium transition hover:bg-indigo-700"
                >
                  My Posted Tasks
                </button>
                <button
                  onClick={() => router.push("/offers/manage")}
                  className="px-6 py-3 bg-pink-600 text-white rounded-lg font-medium transition hover:bg-pink-700"
                >
                  Manage Offers
                </button>
              </>
            )}

            {role === "PROVIDER" && (
              <>
                <button
                  onClick={() => router.push("/skills/create")}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium transition hover:bg-purple-700"
                >
                  Create Skill
                </button>
                <button
                  onClick={() => router.push("/tasks/my-accepted")}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium transition hover:bg-indigo-700"
                >
                  My Accepted Tasks
                </button>
                <button
                  onClick={() => router.push("/offers/create")}
                  className="px-6 py-3 bg-pink-600 text-white rounded-lg font-medium transition hover:bg-pink-700"
                >
                  Make Offer
                </button>
              </>
            )}
          </>
        )}
      </div>
    </main>
  );
}