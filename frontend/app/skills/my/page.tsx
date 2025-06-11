"use client";

import { useEffect, useState } from "react";
import { useAxios } from "@/app/hooks/useAxios";
import { useAuth } from "@/app/context/authContext";
import { useRouter } from "next/navigation";

export default function MySkillsPage() {
  const { authToken, role } = useAuth();
  const axios = useAxios();
  const router = useRouter();

  const [skills, setSkills] = useState<any[]>([]);
  const [error, setError] = useState("");

  const fetchMySkills = async () => {
    try {
      const response = await axios.get("/skills/my");
      setSkills(response.data.skills || []);
    } catch (err) {
      console.error("Fetch My Skills error:", err);
      setError("Failed to load skills");
    }
  };

  useEffect(() => {
    if (!authToken || role !== "PROVIDER") return;
    fetchMySkills();
  }, [authToken, axios, role]);

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
    <main className="flex items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="w-full max-w-3xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          My Skills
        </h1>

        {error && (
          <p className="text-sm text-red-500 mb-4 text-center">
            {error}
          </p>
        )}

        {skills.length === 0 ? (
          <p className="text-gray-700 text-center">You have not created any skills.</p>
        ) : (
          <div className="space-y-6">
            {skills.map((skill) => (
              <div
                key={skill.id}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <div className="space-y-1 text-gray-800">
                  <p>
                    <strong>Category:</strong> {skill.category}
                  </p>
                  <p>
                    <strong>Experience Years:</strong> {skill.experienceYears}
                  </p>
                  <p>
                    <strong>Work Nature:</strong> {skill.workNature}
                  </p>
                  <p>
                    <strong>Hourly Rate:</strong> {skill.hourlyRate} {skill.currency}
                  </p>
                </div>
                <button
                  onClick={() => router.push(`/skills/update/${skill.id}`)}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Edit
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
