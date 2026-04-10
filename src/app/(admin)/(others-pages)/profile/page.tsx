"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    country: "",
    image: null as File | null,
  });

  const [preview, setPreview] = useState<string>("");

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const userData = JSON.parse(localStorage.getItem("user") || "{}");

        const userId = userData?._id || userData?.id;

        const res = await axios.get(
          `http://localhost:5000/api/v1/users/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const fetchedUser = res.data.user;

        setUser(fetchedUser);

        // ✅ FIXED (NO undefined values)
        setFormData({
          fullName: fetchedUser.fullName || "",
          age: fetchedUser.age || "",
          country: fetchedUser.country || "",
          image: null,
        });

        if (fetchedUser.image) {
          setPreview(
            `http://localhost:5000/uploads/${fetchedUser.image}`
          );
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchUser();
  }, []);

  const handleProfileUpdate = async () => {
    try {
      const token = localStorage.getItem("token");

      const data = new FormData();
      data.append("fullName", formData.fullName);
      data.append("age", formData.age);
      data.append("country", formData.country);

      if (formData.image) {
        data.append("image", formData.image);
      }

      const res = await axios.put(
        `http://localhost:5000/api/v1/users/me/update`,
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedUser = res.data.user;

      setUser(updatedUser);

      // ✅ AGAIN FIX CONTROLLED INPUT
      setFormData({
        fullName: updatedUser.fullName || "",
        age: updatedUser.age || "",
        country: updatedUser.country || "",
        image: null,
      });

      alert("Profile updated ✅");
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  const handlePasswordChange = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/v1/users/me/change-password`,
        passwordData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPasswordData({ oldPassword: "", newPassword: "" });

      alert("Password updated ✅");
    } catch (error) {
      console.error("Password error:", error);
    }
  };

  if (!user) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      
      <h2 className="text-3xl font-bold text-gray-800">My Profile</h2>

      {/* PROFILE CARD */}
      <div className="bg-white shadow-lg rounded-2xl p-6 flex gap-8 items-center">
        
        {/* IMAGE */}
        <div className="flex flex-col items-center gap-3">
          <img
            src={
              preview ||
              "https://via.placeholder.com/120?text=Profile"
            }
            className="w-28 h-28 rounded-full object-cover border"
          />

          <input
            type="file"
            className="text-sm"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setFormData({ ...formData, image: file });
                setPreview(URL.createObjectURL(file));
              }
            }}
          />
        </div>

        {/* FORM */}
        <div className="flex-1 grid grid-cols-2 gap-4">
          
          {/* NAME */}
          <div>
            <label className="text-sm text-gray-500">Full Name</label>
            <input
              className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
              value={formData.fullName || ""}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
            />
          </div>

          {/* EMAIL */}
          <div>
            <label className="text-sm text-gray-500">Email</label>
            <input
              disabled
              value={user.email || ""}
              className="w-full mt-1 p-2 border rounded-lg bg-gray-100"
            />
          </div>

          {/* AGE */}
          <div>
            <label className="text-sm text-gray-500">Age</label>
            <input
              type="number"
              className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
              value={formData.age || ""}
              onChange={(e) =>
                setFormData({ ...formData, age: e.target.value })
              }
            />
          </div>

          {/* COUNTRY */}
          <div>
            <label className="text-sm text-gray-500">Country</label>
            <input
              className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
              value={formData.country || ""}
              onChange={(e) =>
                setFormData({ ...formData, country: e.target.value })
              }
            />
          </div>

          {/* STATUS */}
          <div>
            <label className="text-sm text-gray-500">Status</label>
            <input
              disabled
              value={user.status || ""}
              className="w-full mt-1 p-2 border rounded-lg bg-gray-100"
            />
          </div>

          {/* ROLE */}
          <div>
            <label className="text-sm text-gray-500">Role</label>
            <input
              disabled
              value={user.role?.name || ""}
              className="w-full mt-1 p-2 border rounded-lg bg-gray-100"
            />
          </div>
        </div>
      </div>

      {/* SAVE BUTTON */}
      <div className="text-right">
        <button
          onClick={handleProfileUpdate}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow"
        >
          Save Changes
        </button>
      </div>

      {/* PASSWORD CARD */}
      <div className="bg-white shadow-lg rounded-2xl p-6 space-y-4">
        <h3 className="text-xl font-semibold text-gray-700">
          Change Password
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <input
            type="password"
            placeholder="Old Password"
            value={passwordData.oldPassword}
            className="p-2 border rounded-lg focus:ring-2 focus:ring-red-400"
            onChange={(e) =>
              setPasswordData({
                ...passwordData,
                oldPassword: e.target.value,
              })
            }
          />

          <input
            type="password"
            placeholder="New Password"
            value={passwordData.newPassword}
            className="p-2 border rounded-lg focus:ring-2 focus:ring-green-400"
            onChange={(e) =>
              setPasswordData({
                ...passwordData,
                newPassword: e.target.value,
              })
            }
          />
        </div>

        <div className="text-right">
          <button
            onClick={handlePasswordChange}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg shadow"
          >
            Update Password
          </button>
        </div>
      </div>
    </div>
  );
}