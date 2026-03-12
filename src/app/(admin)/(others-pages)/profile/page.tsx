"use client";

import React, { useEffect, useState } from "react";

export default function ProfilePage() {

  const [user, setUser] = useState<any>(null);

  useEffect(() => {

    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

  }, []);

  return (

    <div className="p-6">

      <h1 className="text-2xl font-semibold mb-6">
        User Profile
      </h1>

      <div className="bg-white shadow rounded-lg p-6 max-w-lg">

        <div className="mb-4">
          <label className="text-gray-600">Full Name</label>
          <p className="text-lg font-medium">
            {user?.fullName || "N/A"}
          </p>
        </div>

        <div className="mb-4">
          <label className="text-gray-600">Email</label>
          <p className="text-lg font-medium">
            {user?.email || "N/A"}
          </p>
        </div>

        <div className="mb-4">
          <label className="text-gray-600">Role</label>
          <p className="text-lg font-medium">
            {user?.role || "N/A"}
          </p>
        </div>

      </div>

    </div>
  );
}