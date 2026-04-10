"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";

type Role = {
  _id: string;
  name: string;
  status: string;
  createdAt: string;
};

export default function RolePage() {

  const router = useRouter();

  const [roles, setRoles] = useState<Role[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    status: "active"
  });
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ PROTECT PAGE (ADMIN ONLY)
  useEffect(() => {

    const role = localStorage.getItem("role");

    console.log("CURRENT ROLE:", role);

    if (role !== "Admin") {
      notFound();
    } else {
      fetchRoles();
    }

  }, []);

  const fetchRoles = async () => {
    try {

      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/v1/roles",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRoles(res.data);

    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();

    try {

      const token = localStorage.getItem("token");

      if (editId) {

        await axios.put(
          `http://localhost:5000/api/v1/roles/${editId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

      } else {

        await axios.post(
          "http://localhost:5000/api/v1/roles",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

      }

      setFormData({ name: "", status: "active" });
      setEditId(null);

      fetchRoles();

    } catch (error) {
      console.error("Error saving role:", error);
    }
  };

  const handleEdit = (role: Role) => {

    setFormData({
      name: role.name,
      status: role.status
    });

    setEditId(role._id);
  };

  const handleDelete = async (id: string) => {

    try {

      const token = localStorage.getItem("token");

      await axios.delete(
        `http://localhost:5000/api/v1/roles/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      fetchRoles();

    } catch (error) {
      console.error("Error deleting role:", error);
    }
  };

  // ✅ LOADING STATE
  if (loading) return <div className="p-6">Checking Access...</div>;

  return (
    <div className="p-6 space-y-6">

      <h1 className="text-2xl font-semibold">
        Role Management
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow space-y-4"
      >

        <input
          type="text"
          name="name"
          placeholder="Role Name"
          value={formData.name}
          onChange={handleChange}
          className="border p-2 rounded w-full"
          required
        />

        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {editId ? "Update Role" : "Add Role"}
        </button>

      </form>

      <div className="bg-white p-6 rounded-xl shadow">

        <table className="w-full border">

          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Role Name</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Created</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>

          <tbody>

            {roles.length === 0 ? (

              <tr>
                <td colSpan={4} className="text-center p-4">
                  No roles found
                </td>
              </tr>

            ) : (

              roles.map((role) => (

                <tr key={role._id}>

                  <td className="p-2 border">{role.name}</td>

                  <td className="p-2 border">{role.status}</td>

                  <td className="p-2 border">
                    {new Date(role.createdAt).toLocaleDateString()}
                  </td>

                  <td className="p-2 border space-x-2">

                    <button
                      onClick={() => handleEdit(role)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(role._id)}
                      className="bg-red-600 text-white px-2 py-1 rounded"
                    >
                      Delete
                    </button>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}