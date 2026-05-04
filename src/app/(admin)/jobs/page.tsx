"use client";

import { useJobs } from "@/hooks/useJob";
import { useRouter } from "next/navigation";
import { useState, useMemo, useEffect, useCallback } from "react";
import axios from "axios";
import io from "socket.io-client";

const API = "http://localhost:5000/api/jobs";

// ─── Types ────────────────────────────────────────────────────────────────────
interface NonAdminUser {
  _id: string;
  fullName: string;
  email: string;
  role?: { name: string };
}

const JOB_ROLES = ["design", "QC", "production", "dispatch"] as const;
type JobRole = (typeof JOB_ROLES)[number];

const getStatusColor = (status: string) => {
  switch (status) {
    case "DRAFT":
    case "Draft":
      return "bg-slate-100 text-slate-700";
    case "DESIGN":
      return "bg-sky-100 text-sky-700";
    case "QC":
      return "bg-purple-100 text-purple-700";
    case "PRODUCTION":
      return "bg-orange-100 text-orange-700";
    case "DISPATCH":
      return "bg-blue-100 text-blue-700";
    case "ASSIGNED":
    case "Assigned":
      return "bg-indigo-100 text-indigo-700";
    case "WORKING_IN_PROGRESS":
    case "Working in Progress":
      return "bg-amber-100 text-amber-700";
    case "PENDING_QC":
    case "Pending QC":
      return "bg-purple-100 text-purple-700";
    case "COMPLETED":
    case "Completed":
      return "bg-emerald-100 text-emerald-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

// ─── Assign Modal ─────────────────────────────────────────────────────────────
interface AssignModalProps {
  job: any;
  onClose: () => void;
  onSuccess: () => void;
}

function AssignModal({ job, onClose, onSuccess }: AssignModalProps) {
  const [users, setUsers] = useState<NonAdminUser[]>([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedRole, setSelectedRole] = useState<JobRole | "">("");
  const [loading, setLoading] = useState(false);
  const [fetchingUsers, setFetchingUsers] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch non-admin users when modal opens
  useEffect(() => {
    const fetchUsers = async () => {
      setFetchingUsers(true);
      try {
        const res = await axios.get(`${API}/assign/users`);
        setUsers(res.data.users || []);
      } catch (err: any) {
        setError("Failed to load users. Please try again.");
        console.error("Fetch users error:", err);
      } finally {
        setFetchingUsers(false);
      }
    };

    fetchUsers();
  }, []);

  const handleAssign = async () => {
    if (!selectedUser) {
      setError("Please select an employee.");
      return;
    }
    if (!selectedRole) {
      setError("Please select a job role.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await axios.post(`${API}/${job._id}/assign`, {
        userId: selectedUser,
        jobRole: selectedRole,
      });

      const assignedUser = users.find((u) => u._id === selectedUser);
      setSuccess(
        `✅ Job successfully assigned to ${assignedUser?.fullName || "employee"}. An email notification has been sent.`
      );

      // Auto-close after short delay
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2000);
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Assignment failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    // Backdrop — rgba so it works regardless of parent theme
    <div
      style={{ backgroundColor: "rgba(0,0,0,0.55)" }}
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Modal Card — inline style forces white regardless of dark theme */}
      <div
        className="rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden"
        style={{ backgroundColor: "#ffffff", color: "#111827" }}
      >
        {/* Header */}
        <div className="bg-indigo-600 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">
            Assigning Employee
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:text-indigo-200 text-2xl leading-none"
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4" style={{ backgroundColor: "#ffffff" }}>
          {/* Job Info */}
          <div className="rounded-lg px-4 py-3 text-sm space-y-1 border" style={{ backgroundColor: "#f9fafb", color: "#4b5563", borderColor: "#e5e7eb" }}>
            <p>
              <span className="font-medium" style={{ color: "#1f2937" }}>Job ID:</span>{" "}
              {job.jobId || "—"}
            </p>
            <p>
              <span className="font-medium" style={{ color: "#1f2937" }}>Job Name:</span>{" "}
              {job.jobDetail?.jobName || "—"}
            </p>
            <p>
              <span className="font-medium" style={{ color: "#1f2937" }}>Customer:</span>{" "}
              {job.jobDetail?.customerName || "—"}
            </p>
            <p>
              <span className="font-medium" style={{ color: "#1f2937" }}>Current Status:</span>{" "}
              <span
                className={`px-2 py-0.5 rounded text-xs ${getStatusColor(
                  job.status
                )}`}
              >
                {job.status || "NEW"}
              </span>
            </p>
          </div>

          {/* Error / Success messages */}
          {error && (
            <p className="text-sm rounded px-3 py-2" style={{ color: "#dc2626", backgroundColor: "#fef2f2", border: "1px solid #fecaca" }}>
              {error}
            </p>
          )}
          {success && (
            <p className="text-sm rounded px-3 py-2" style={{ color: "#15803d", backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0" }}>
              {success}
            </p>
          )}

          {/* Employee Dropdown */}
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "#374151" }}>
              Select Employee <span style={{ color: "#ef4444" }}>*</span>
            </label>
            {fetchingUsers ? (
              <p className="text-sm italic" style={{ color: "#6b7280" }}>Loading users…</p>
            ) : (
              <select
                value={selectedUser}
                onChange={(e) => {
                  setSelectedUser(e.target.value);
                  setError("");
                }}
                className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                style={{ border: "1px solid #d1d5db", backgroundColor: "#ffffff", color: "#111827" }}
              >
                <option value="">— Choose an employee —</option>
                {users.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.fullName}{" "}
                    {u.role?.name ? `(${u.role.name})` : ""} — {u.email}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Job Role Dropdown */}
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "#374151" }}>
              Assign Job Role <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <select
              value={selectedRole}
              onChange={(e) => {
                setSelectedRole(e.target.value as JobRole | "");
                setError("");
              }}
              className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              style={{ border: "1px solid #d1d5db", backgroundColor: "#ffffff", color: "#111827" }}
            >
              <option value="">— Choose a role —</option>
              {JOB_ROLES.map((role) => (
                <option key={role} value={role}>
                  {role.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 flex justify-end gap-3" style={{ backgroundColor: "#f9fafb", borderTop: "1px solid #e5e7eb" }}>
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm rounded-lg transition disabled:opacity-50"
            style={{ border: "1px solid #d1d5db", color: "#374151", backgroundColor: "#ffffff" }}
          >
            Cancel
          </button>
          <button
            onClick={handleAssign}
            disabled={loading || fetchingUsers || !!success}
            className="px-4 py-2 text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition disabled:opacity-50 flex items-center gap-2"
          >
            {loading && (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            {loading ? "Saving…" : "Save Assignment"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function JobList() {
  const jobs: any[] = useJobs();
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Assign modal state
  const [assigningJob, setAssigningJob] = useState<any | null>(null);

  // ✅ Live employee status overrides — updated via socket without re-fetching all jobs
  const [liveStatusMap, setLiveStatusMap] = useState<Record<string, string>>({});

  useEffect(() => {
    const socket = io("http://localhost:5000", { transports: ["websocket"] });
    socket.on("employee_status_updated", (data: { jobId: string; employeeStatus: string }) => {
      setLiveStatusMap((prev) => ({ ...prev, [data.jobId]: data.employeeStatus }));
    });
    return () => { socket.disconnect(); };
  }, []);

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("Are you sure you want to delete?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`${API}/${id}`);
      window.location.reload();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const filteredJobs = useMemo(() => {
    return jobs?.filter(
      (job: any) =>
        job.jobDetail?.customerName
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        job.jobDetail?.jobName
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        job.jobDetail?.poNumber
          ?.toLowerCase()
          .includes(search.toLowerCase())
    );
  }, [jobs, search]);

  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);

  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-6">
      {/* Title + Add Job Button */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Jobs List</h1>
        <button
          onClick={() => router.push("/jobs/create")}
          className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
        >
          + Add Job
        </button>
      </div>

      {/* 🔍 SEARCH */}
      <input
        type="text"
        placeholder="Search by customer, job name, PO..."
        className="mb-4 p-2 border rounded w-full md:w-1/3"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1);
        }}
      />

      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="w-full text-sm text-left border-collapse">
          {/* HEADER */}
          <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 border">Job ID</th>
              <th className="px-4 py-3 border">Customer</th>
              <th className="px-4 py-3 border">Job Name</th>
              <th className="px-4 py-3 border">PO Number</th>
              <th className="px-4 py-3 border">Mobile</th>
              <th className="px-4 py-3 border">Status</th>
              <th className="px-4 py-3 border text-center">Actions</th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {paginatedJobs.length > 0 ? (
              paginatedJobs.map((job: any) => (
                <tr key={job._id} className="border-b hover:bg-gray-50">
                  <td className="p-2 border">{job.jobId || "—"}</td>
                  <td className="p-2 border">
                    {job.jobDetail?.customerName || "—"}
                  </td>
                  <td className="p-2 border">
                    {job.jobDetail?.jobName || "—"}
                  </td>
                  <td className="p-2 border">
                    {job.jobDetail?.poNumber || "—"}
                  </td>
                  <td className="p-2 border">
                    {job.contactDetails?.mobile || "—"}
                  </td>

                  {/* 🎨 UNIFIED STATUS */}
                  <td className="p-2 border text-center">
                    {(() => {
                      const displayStatus = (liveStatusMap[job._id] ?? job.employeeStatus ?? job.status ?? "NEW").replace(/_/g, " ");
                      return (
                        <span
                          className={`px-3 py-1 text-[10px] rounded-full font-bold uppercase tracking-wider ${getStatusColor(
                            displayStatus.replace(/ /g, "_").toUpperCase() === "WORKING IN PROGRESS" ? "WORKING_IN_PROGRESS" : displayStatus
                          )}`}
                        >
                          {displayStatus}
                        </span>
                      );
                    })()}
                  </td>

                  {/* ⚙️ ACTIONS */}
                  <td className="p-2 border text-center space-x-2">
                    <button
                      onClick={() => router.push(`/jobs/edit/${job._id}`)}
                      className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(job._id)}
                      className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition"
                    >
                      Delete
                    </button>

                    <button
                      onClick={() => setAssigningJob(job)}
                      className="px-3 py-1 text-xs bg-indigo-500 text-white rounded hover:bg-indigo-600 transition"
                    >
                      Assign
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center p-4">
                  No jobs found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 📄 PAGINATION */}
      <div className="flex justify-between items-center mt-4">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Prev
        </button>

        <span className="text-sm">
          Page {currentPage} of {totalPages || 1}
        </span>

        <button
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => setCurrentPage((prev) => prev + 1)}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* ✅ Assign Modal */}
      {assigningJob && (
        <AssignModal
          job={assigningJob}
          onClose={() => setAssigningJob(null)}
          onSuccess={() => {
            // Optionally trigger a re-fetch; simple reload works too
            window.location.reload();
          }}
        />
      )}
    </div>
  );
}
