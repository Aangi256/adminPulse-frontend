"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("user");

        if (!token || !userData) {
          console.error("Token or userData missing");
          return;
        }

        const parsedUser = JSON.parse(userData);

        // ✅ HANDLE ALL CASES (IMPORTANT FIX)
        const userId =
          parsedUser?.id ||
          parsedUser?._id ||
          parsedUser?.user?.id ||
          parsedUser?.user?._id;

        console.log("User ID:", userId);

        if (!userId) {
          console.error("User ID is undefined ❌");
          return;
        }

        const res = await axios.get(
          `http://localhost:5000/api/v1/users/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Profile Data:", res.data);

        setUser(res.data.user);
      } catch (error) {
        console.error("Profile fetch error:", error);
      } finally {
        setLoading(false); // ✅ VERY IMPORTANT
      }
    };

    fetchUser();
  }, []);

  // ✅ LOADING STATE
  if (loading) {
    return <p className="p-6">Loading user profile...</p>;
  }

  // ✅ ERROR STATE
  if (!user) {
    return <p className="p-6 text-red-500">Failed to load user ❌</p>;
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Profile</h2>

      <div className="space-y-4">
        <p><b>Name:</b> {user.fullName}</p>
        <p><b>Email:</b> {user.email}</p>
        <p><b>Age:</b> {user.age || "N/A"}</p>
        <p><b>Country:</b> {user.country || "N/A"}</p>
        <p><b>Status:</b> {user.status || "N/A"}</p>
        <p><b>Role:</b> {user.role?.name || "N/A"}</p>
      </div>
    </div>
  );
}