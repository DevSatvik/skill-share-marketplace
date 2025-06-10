"use client";

import { useEffect, useState } from "react";
import { useAxios } from "../hooks/useAxios";
import { useAuth } from "../context/authContext";

type Profile = {
  role: string;
  type: string;
  email: string;
  mobileNumber: string;
  firstName?: string;
  lastName?: string;
  addressStreetNumber?: string;
  addressStreetName?: string;
  addressCitySuburb?: string;
  addressState?: string;
  addressPostcode?: string;
  companyName?: string;
  companyPhoneNumber?: string;
  taxID?: string;
  repFirstName?: string;
  repLastName?: string;
};

export default function ProfilePage() {
  const axios = useAxios();
  const { authToken } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    if (!authToken) return;

    axios
      .get("/me")
      .then((res) => setProfile(res.data.user))
      .catch((err) => console.error(err));
  }, [authToken, axios]);

  if (!profile)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-lg text-gray-600">Loading profile...</p>
      </div>
    );

  const isIndividual = profile.type === "INDIVIDUAL";
  const isCompany = profile.type === "COMPANY";

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">
            My Profile
          </h1>

          <div className="space-y-8">
            {/* General Info */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
                General Information
              </h2>
              <p className="text-gray-700">
                <strong className="font-medium">Role:</strong> {profile.role}
              </p>
              <p className="text-gray-700">
                <strong className="font-medium">Account Type:</strong> {profile.type}
              </p>
              <p className="text-gray-700">
                <strong className="font-medium">Email:</strong> {profile.email}
              </p>
              <p className="text-gray-700">
                <strong className="font-medium">Mobile Number:</strong> {profile.mobileNumber}
              </p>
            </section>

            {/* Individual */}
            {isIndividual && (
              <>
                <section>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
                    Personal Information
                  </h2>
                  <p className="text-gray-700">
                    <strong className="font-medium">First Name:</strong> {profile.firstName}
                  </p>
                  <p className="text-gray-700">
                    <strong className="font-medium">Last Name:</strong> {profile.lastName}
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
                    Address
                  </h2>
                  <p className="text-gray-700">
                    {profile.addressStreetNumber} {profile.addressStreetName}
                  </p>
                  <p className="text-gray-700">
                    {profile.addressCitySuburb}, {profile.addressState} {profile.addressPostcode}
                  </p>
                </section>
              </>
            )}

            {/* Company */}
            {isCompany && (
              <>
                <section>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
                    Company Information
                  </h2>
                  <p className="text-gray-700">
                    <strong className="font-medium">Company Name:</strong> {profile.companyName}
                  </p>
                  <p className="text-gray-700">
                    <strong className="font-medium">Company Phone Number:</strong> {profile.companyPhoneNumber}
                  </p>
                  <p className="text-gray-700">
                    <strong className="font-medium">Tax ID:</strong> {profile.taxID}
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
                    Company Representative
                  </h2>
                  <p className="text-gray-700">
                    {profile.repFirstName} {profile.repLastName}
                  </p>
                </section>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
