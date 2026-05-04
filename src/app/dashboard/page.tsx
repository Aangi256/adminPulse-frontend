"use client";

import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import io from "socket.io-client";

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
  assignedTo?: string | { _id: string };
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

  // ✅ Live status map: jobId -> employeeStatus, updated via socket in real-time
  const [liveStatusMap, setLiveStatusMap] = useState<Record<string, string>>({});

  useEffect(() => {
    const socket = io("http://localhost:5000", { transports: ["websocket"] });
    socket.on("employee_status_updated", (data: { jobId: string; employeeStatus: string }) => {
      setLiveStatusMap((prev) => ({ ...prev, [data.jobId]: data.employeeStatus }));
    });
    return () => { socket.disconnect(); };
  }, []);

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
    const assignedJobs = adminJobs.filter((job) => {
      if (!job.assignedTo) return false;
      const jobUserId = typeof job.assignedTo === "string" ? job.assignedTo : (job.assignedTo as any)?._id;
      return jobUserId === user._id;
    });

    // ✅ Use live socket status if available, otherwise fall back to DB value
    const resolvedJobs = assignedJobs.map((job) => ({
      ...job,
      employeeStatus: liveStatusMap[job._id] ?? job.employeeStatus,
    }));

    const totalAssigned = resolvedJobs.length;
    const draft = resolvedJobs.filter(j => j.employeeStatus === "Draft").length;
    const inProgress = resolvedJobs.filter(j => j.employeeStatus === "Working in Progress" || j.employeeStatus === "Pending QC").length;
    const completed = resolvedJobs.filter(j => j.employeeStatus === "Completed").length;
    const assignedStatus = resolvedJobs.filter(j => !j.employeeStatus || j.employeeStatus === "Assigned").length;

    // ✅ Calculate weighted progress: Completed = 100%, Pending QC = 80%, Working in Progress = 50%
    const totalProgressPoints = resolvedJobs.reduce((acc, j) => {
      if (j.employeeStatus === "Completed") return acc + 100;
      if (j.employeeStatus === "Pending QC") return acc + 80;
      if (j.employeeStatus === "Working in Progress") return acc + 50;
      return acc;
    }, 0);

    const progressPercentage = totalAssigned > 0 
      ? Math.round(totalProgressPoints / totalAssigned) 
      : 0;

    return {
      ...user,
      totalAssigned,
      draft,
      inProgress,
      completed,
      assignedStatus,
      progressPercentage
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
                    {(() => {
                      const empStatus = liveStatusMap[job._id] ?? job.employeeStatus;
                      const colors: Record<string, string> = {
                        "Assigned": "bg-blue-100 text-blue-700",
                        "Working in Progress": "bg-yellow-100 text-yellow-700",
                        "Pending QC": "bg-purple-100 text-purple-700",
                        "Completed": "bg-green-100 text-green-700",
                      };
                      return (
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${colors[empStatus || "Assigned"] || "bg-indigo-100 text-indigo-800"}`}>
                          {empStatus || "Assigned"}
                        </span>
                      );
                    })()}
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
                    const progressPercentage = stat.progressPercentage;

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
