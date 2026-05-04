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
  
  // Admin states
  const [adminJobs, setAdminJobs] = useState<Job[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);

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
    if (!role) return;

    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        if (role === "Admin") {
          const [jobsRes, usersRes] = await Promise.all([
            axios.get(API, { headers }),
            axios.get(`${API}/assign/users`, { headers })
          ]);
          setAdminJobs(jobsRes.data);
          setAllUsers(usersRes.data.users || []);
        } else if (userId) {
          const res = await axios.get(API, { headers });
          const employeeJobs = res.data.filter(
            (j: Job) => j.assignedTo === userId
          );
          setMyJobs(employeeJobs);
        }
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [role, userId]);

  if (loading) {
    return <div className="p-6">Loading dashboard...</div>;
  }

  const employeeStats = allUsers.map((user) => {
    const assignedJobs = adminJobs.filter((job) => job.assignedTo === user._id);
    
    const totalAssigned = assignedJobs.length;
    const draft = assignedJobs.filter(j => j.employeeStatus === "Draft").length;
    const inProgress = assignedJobs.filter(j => j.employeeStatus === "Working in Progress").length;
    const completed = assignedJobs.filter(j => j.employeeStatus === "Completed").length;
    const assignedStatus = assignedJobs.filter(j => !j.employeeStatus || j.employeeStatus === "Assigned").length;

    return {
      ...user,
      totalAssigned,
      draft,
      inProgress,
      completed,
      assignedStatus
    };
  });

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
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-6 text-gray-800">Employee Work Tracking</h2>
          
          {employeeStats.length === 0 ? (
            <p className="text-gray-500">No employees found to track.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="p-3 border">Employee Name</th>
                    <th className="p-3 border">Email</th>
                    <th className="p-3 border text-center">Total Assigned</th>
                    <th className="p-3 border text-center text-blue-600">Pending</th>
                    <th className="p-3 border text-center text-yellow-600">In Progress</th>
                    <th className="p-3 border text-center text-green-600">Completed</th>
                    <th className="p-3 border">Progress</th>
                  </tr>
                </thead>
                <tbody>
                  {employeeStats.map((stat) => {
                    const pending = stat.draft + stat.assignedStatus;
                    const progressPercentage = stat.totalAssigned > 0 
                      ? Math.round((stat.completed / stat.totalAssigned) * 100) 
                      : 0;

                    return (
                      <tr key={stat._id} className="hover:bg-gray-50 transition">
                        <td className="p-3 border font-medium">{stat.fullName}</td>
                        <td className="p-3 border text-gray-600">{stat.email}</td>
                        <td className="p-3 border text-center font-bold">{stat.totalAssigned}</td>
                        <td className="p-3 border text-center">{pending}</td>
                        <td className="p-3 border text-center">{stat.inProgress}</td>
                        <td className="p-3 border text-center">{stat.completed}</td>
                        <td className="p-3 border">
                          <div className="flex items-center gap-2">
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
                            </div>
                            <span className="text-xs font-semibold min-w-[3ch]">{progressPercentage}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
