"use client";
import { useAuth } from "@/app/context/authContext";
import type { ReactNode, FC } from "react";

interface NavbarProps {
  children: ReactNode;
}

const Navbar: FC<NavbarProps> = ({ children }) => {
  const { authToken, role, logout } = useAuth();
  const router = useAuth() ? require("next/navigation").useRouter() : null;

  return (
    <>
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div
            className="text-2xl font-bold text-blue-600 cursor-pointer hover:text-blue-700 transition"
            onClick={() => router && router.push("/")}
          >
            SkillShare App
          </div>

          <div className="flex space-x-4">
            {!authToken && (
              <>
                <button
                  onClick={() => router.push("/login")}
                  className="text-gray-600 hover:text-blue-600 transition"
                >
                  Login
                </button>
                <button
                  onClick={() => router.push("/register")}
                  className="text-gray-600 hover:text-blue-600 transition"
                >
                  Register
                </button>
              </>
            )}

            {authToken && (
              <>
                <button
                  onClick={() => router.push("/profile")}
                  className="text-gray-600 hover:text-blue-600 transition"
                >
                  Profile
                </button>

                <button
                  onClick={logout}
                  className="text-red-500 hover:text-red-600 transition"
                >
                  Logout
                </button>

                {/* USER buttons */}
                {role === "USER" && (
                  <>
                    <button
                      onClick={() => router.push("/tasks/create")}
                      className="text-gray-600 hover:text-blue-600 transition"
                    >
                      Create Task
                    </button>
                    <button
                      onClick={() => router.push("/tasks/my-posted")}
                      className="text-gray-600 hover:text-blue-600 transition"
                    >
                      My Posted Tasks
                    </button>
                    <button
                      onClick={() => router.push("/offers/manage")}
                      className="text-gray-600 hover:text-blue-600 transition"
                    >
                      Manage Offers
                    </button>
                  </>
                )}

                {role === "PROVIDER" && (
                  <>
                    <button
                      onClick={() => router.push("/skills/create")}
                      className="hover:underline"
                    >
                      Create Skill
                    </button>
                    <button
                      onClick={() => router.push("/skills/my")}
                      className="hover:underline"
                    >
                      My Skills
                    </button>
                    <button
                      onClick={() => router.push("/tasks/my-accepted")}
                      className="hover:underline"
                    >
                      My Accepted Tasks
                    </button>
                    <button
                      onClick={() => router.push("/offers")}
                      className="hover:underline"
                    >
                      Offers
                    </button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="container mx-auto px-6 py-8">{children}</main>
    </>
  );
}

export default Navbar;
