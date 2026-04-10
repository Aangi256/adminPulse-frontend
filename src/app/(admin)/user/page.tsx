"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";

export default function UserPage() {

  const router = useRouter();

  const [roles, setRoles] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [editId, setEditId] = useState<string | null>(null);
  const [passwordEditId, setPasswordEditId] = useState<string | null>(null);

  const [newPassword, setNewPassword] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    email: "",
    country: "",
    role: "",
    status: "active"
  });

  /* 🔥 PROTECT ROUTE */
  useEffect(() => {
    const role = localStorage.getItem("role");

    if (role !== "Admin") {
      notFound();
    } else {
      loadData();
    }
  }, []);

  const loadData = async () => {
    try {
      await fetchRoles();
      await fetchUsers();
    } catch (err) {
      console.error("LOAD ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/v1/roles",
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setRoles(res.data);
    } catch (error) {
      console.error("FETCH ROLES ERROR:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/v1/users",
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setUsers(res.data.users);
    } catch (error) {
      console.error("FETCH USERS ERROR:", error);
    }
  };

  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleEdit = (user: any) => {
    setFormData({
      fullName: user.fullName,
      age: user.age,
      email: user.email,
      country: user.country,
      role: user.role?._id,
      status: user.status
    });

    setEditId(user._id);
    setPasswordEditId(null);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    const data = new FormData();

    Object.keys(formData).forEach((key) => {
      data.append(key, (formData as any)[key]);
    });

    if (image) {
      data.append("image", image);
    }

    try {
      if (editId) {
        await axios.put(
          `http://localhost:5000/api/v1/users/${editId}`,
          data,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
      } else {
        await axios.post(
          "http://localhost:5000/api/v1/users",
          data,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
      }

      resetForm();
      fetchUsers();

    } catch (error: any) {
      console.error("SUBMIT ERROR:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  const updatePassword = async (id: string) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/v1/users/update-password/${id}`,
        { password: newPassword },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setPasswordEditId(null);
      setNewPassword("");
      fetchUsers();

    } catch (error) {
      console.error("PASSWORD UPDATE ERROR:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `http://localhost:5000/api/v1/users/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      fetchUsers();

    } catch (error) {
      console.error("DELETE ERROR:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      fullName: "",
      age: "",
      email: "",
      country: "",
      role: "",
      status: "active"
    });

    setEditId(null);
    setImage(null);
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 space-y-6">

      <h1 className="text-2xl font-semibold">User Management</h1>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow grid grid-cols-2 gap-4"
      >

        <input name="fullName" placeholder="Full Name"
          value={formData.fullName} onChange={handleChange}
          className="border p-2 rounded" required />

        <input name="age" type="number" placeholder="Age"
          value={formData.age} onChange={handleChange}
          className="border p-2 rounded" required />

        <input name="email" type="email" placeholder="Email"
          value={formData.email} onChange={handleChange}
          className="border p-2 rounded" required />

        <input name="country" placeholder="Country"
          value={formData.country} onChange={handleChange}
          className="border p-2 rounded" required />

        <select name="role" value={formData.role}
          onChange={handleChange} className="border p-2 rounded" required>
          <option value="">Select Role</option>
          {roles.map((role: any) => (
            <option key={role._id} value={role._id}>
              {role.name}
            </option>
          ))}
        </select>

        <select name="status" value={formData.status}
          onChange={handleChange} className="border p-2 rounded">
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <input type="file"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
          className="border p-2 rounded" />

        <button className="col-span-2 bg-blue-600 text-white p-2 rounded">
          {editId ? "Update User" : "Add User"}
        </button>

      </form>

      {/* TABLE */}
      <div className="bg-white p-6 rounded-xl shadow">

        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Role</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user: any) => (
              <tr key={user._id}>
                <td className="p-2 border">{user.fullName}</td>
                <td className="p-2 border">{user.email}</td>
                <td className="p-2 border">{user.role?.name}</td>
                <td className="p-2 border">{user.status}</td>

                <td className="p-2 border space-x-2">

                  <button onClick={() => handleEdit(user)}
                    className="bg-blue-500 text-white px-3 py-1 rounded">
                    Edit
                  </button>

                  <button onClick={() => setPasswordEditId(user._id)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded">
                    Edit Password
                  </button>

                  <button onClick={() => handleDelete(user._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded">
                    Delete
                  </button>

                  {passwordEditId === user._id && (
                    <div className="mt-2 flex gap-2">
                      <input type="password"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="border p-1 rounded" />

                      <button
                        onClick={() => updatePassword(user._id)}
                        className="bg-green-600 text-white px-2 rounded">
                        Save
                      </button>
                    </div>
                  )}

                </td>
              </tr>
            ))}
          </tbody>

        </table>

      </div>

    </div>
  );
}