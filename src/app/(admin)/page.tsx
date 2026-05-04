"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Job {
  _id: string;
  jobId: string;
  jobDetail: {
    jobName: string;
    customerName: string;
    poNumber: string;
  };
  contactDetails: {
    preparedBy: string;
    mobile: string;
    email: string;
  };
  employeeStatus?: string;
  assignedTo?: string;
  assignmentHistory?: {
    user: string | { _id: string };
    jobRole: string;
    assignedAt: string;
  }[];
}

const API = "http://localhost:5000/api/jobs";

export default function Ecommerce() {
  const [role, setRole] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [myJobs, setMyJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  // Status edit state
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [newStatus, setNewStatus] = useState<string>("");

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);

    let storedUserId = localStorage.getItem("userId");
    if (!storedUserId) {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        try {
          const userObj = JSON.parse(userStr);
          storedUserId = userObj.id || userObj._id || null;
        } catch (e) { }
      }
    }
    setUserId(storedUserId);
  }, []);

  useEffect(() => {
    if (role === "Admin" || !userId) {
      setLoading(false);
      return;
    }

    const fetchJobs = async () => {
      try {
        const res = await axios.get(API);
        const allJobs = res.data;
        const employeeJobs = allJobs.filter(
          (j: Job) => j.assignedTo === userId
        );
        setMyJobs(employeeJobs);
      } catch (err) {
        console.error("Failed to load jobs", err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [role, userId]);

  const handleStatusUpdate = async () => {
    if (!editingJob) return;
    try {
      await axios.put(`${API}/${editingJob._id}/employee-status`, {
        employeeStatus: newStatus,
      });
      // Update local state
      setMyJobs((prev) =>
        prev.map((j) =>
          j._id === editingJob._id ? { ...j, employeeStatus: newStatus } : j
        )
      );
      setEditingJob(null);
    } catch (err) {
      console.error("Status update failed", err);
    }
  };

  const statusOptions = ["Draft", "Working in Progress", "Assigned", "Completed"];

  if (loading) {
    return <div className="p-6">Loading dashboard...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {role !== "Admin" ? (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">My Assigned Jobs</h2>
          {myJobs.length === 0 ? (
            <p className="text-gray-500">You have no jobs assigned currently.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myJobs.map((job) => (
                <div key={job._id} className="border rounded-xl p-5 shadow-sm bg-gray-50 hover:shadow-md transition">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">{job.jobDetail?.jobName || "Unnamed Job"}</h3>
                      <p className="text-sm text-gray-500">ID: {job.jobId}</p>
                      {/* Show Role */}
                      <p className="text-xs font-medium text-indigo-600 mt-1 uppercase tracking-wide">
                        Role: {
                          [...(job.assignmentHistory || [])]
                            .reverse()
                            .find(a => {
                              const uId = typeof a.user === "string" ? a.user : a.user?._id;
                              return uId === userId;
                            })?.jobRole || "Assigned"
                        }
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-xs font-semibold rounded-full">
                      {job.employeeStatus || "Assigned"}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600 mb-6">
                    <p><strong className="text-gray-700">Customer:</strong> {job.jobDetail?.customerName}</p>
                    <p><strong className="text-gray-700">PO Number:</strong> {job.jobDetail?.poNumber}</p>
                    <p><strong className="text-gray-700">Alloted By:</strong> {job.contactDetails?.preparedBy}</p>
                    <p><strong className="text-gray-700">Contact:</strong> {job.contactDetails?.email} / {job.contactDetails?.mobile}</p>
                  </div>

                  <button
                    onClick={() => {
                      setEditingJob(job);
                      setNewStatus(job.employeeStatus || "Assigned");
                    }}
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition"
                  >
                    Update Work Status
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Modal for updating status */}
          {editingJob && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm">
                <h3 className="text-lg font-bold mb-4">Update Status</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Job: <strong>{editingJob.jobDetail?.jobName}</strong>
                </p>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 mb-6 focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  {statusOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setEditingJob(null)}
                    className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleStatusUpdate}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-12 gap-4 md:gap-6">
          <div className="col-span-12">
            <div className="bg-white p-6 rounded-lg shadow text-gray-500">
              Welcome to the Admin Dashboard.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
