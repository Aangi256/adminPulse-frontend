"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function ProfilePage() {

  const [user, setUser] = useState<any>(null);

  useEffect(() => {

    const fetchUser = async () => {

      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");

      let userId = null;

      if (userData) {
        const parsedUser = JSON.parse(userData);
        userId = parsedUser.id;
      }

      console.log(userId); console.log(token);
      console.log(userId);

      if (!token || !userId) return;

      try {

        const res = await axios.get(
          `http://localhost:5000/api/v1/users/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        setUser(res.data.user);

      } catch (error) {

        console.error(error);

      }

    };

    fetchUser();

  }, []);

  if (!user) {

    return <p className="p-6">Loading user profile...</p>;

  }

  return (

    <div className="p-8">

      <h2 className="text-2xl font-bold mb-6">

        Profile

      </h2>

      <div className="space-y-4">

        <p><b>Name:</b> {user.fullName}</p>
        <p><b>Email:</b> {user.email}</p>
        <p><b>Age:</b> {user.age}</p>
        <p><b>Country:</b> {user.country}</p>
        <p><b>Status:</b> {user.status}</p>
        <p><b>Role:</b> {user.role?.name}</p>

      </div>

    </div>

  );
}