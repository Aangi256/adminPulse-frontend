"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

export default function UserPage() {
  const [roles, setRoles] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    email: "",
    country: "",
    password: "",
    role: "",
    status: "active"
  });

  const [image, setImage] = useState<File | null>(null);
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchRoles();
        await fetchUsers();
      } catch (error) {
        console.error("Initial load failed:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const fetchRoles = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/v1/roles");
      setRoles(res.data);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/v1/users");
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = new FormData();

      Object.keys(formData).forEach((key) => {
        data.append(key, (formData as any)[key]);
      });

      if (image) {
        data.append("image", image);
      }

      if (editId) {
        await axios.put(
          `http://localhost:5000/api/v1/users/${editId}`,
          data
        );
      } else {
        await axios.post(
          "http://localhost:5000/api/v1/users",
          data
        );
      }

      setFormData({
        fullName: "",
        age: "",
        email: "",
        country: "",
        password: "",
        role: "",
        status: "active"
      });

      setImage(null);
      setEditId(null);
      fetchUsers();

    } catch (error) {
      console.error("Submit error:", error);
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">User Details</h1>

      <form
        onSubmit={handleSubmit}
        autoComplete="off"
        className="bg-white p-6 rounded-xl shadow grid grid-cols-2 gap-4"
      >
        <input
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />

        <input
          name="age"
          type="number"
          placeholder="Age"
          value={formData.age}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          autoComplete="new-email"
          className="border p-2 rounded"
          required
        />

        <input
          name="country"
          placeholder="Country"
          value={formData.country}
          onChange={handleChange}
          autoComplete="off"
          className="border p-2 rounded"
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          autoComplete="new-password"
          className="border p-2 rounded"
          required
        />

        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        >
          <option value="">Select Role</option>
          {roles.map((role: any) => (
            <option key={role._id} value={role._id}>
              {role.name}
            </option>
          ))}
        </select>

        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <input
          type="file"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
          className="border p-2 rounded"
        />

        <button className="col-span-2 bg-blue-600 text-white p-2 rounded">
          {editId ? "Update User" : "Add User"}
        </button>
      </form>

      <div className="bg-white p-6 rounded-xl shadow">
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Role</th>
              <th className="p-2 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center p-4">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user: any) => (
                <tr key={user._id}>
                  <td className="p-2 border">{user.fullName}</td>
                  <td className="p-2 border">{user.email}</td>
                  <td className="p-2 border">{user.role?.name}</td>
                  <td className="p-2 border">{user.status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}