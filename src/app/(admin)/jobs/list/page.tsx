"use client";

import { useJobs } from "@/hooks/useJob";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import axios from "axios";

const API = "http://localhost:5000/api/jobs";

export default function JobList() {
    const jobs: any[] = useJobs();
    const router = useRouter();

    // ✅ SEARCH STATE
    const [search, setSearch] = useState("");

    // ✅ PAGINATION STATE
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // ✅ STATUS COLOR MAPPING
    const getStatusColor = (status: string) => {
        switch (status) {
            case "DESIGN":
                return "bg-yellow-100 text-yellow-700";
            case "QC":
                return "bg-purple-100 text-purple-700";
            case "PRODUCTION":
                return "bg-blue-100 text-blue-700";
            case "COMPLETED":
                return "bg-green-100 text-green-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    // ✅ DELETE JOB
    const handleDelete = async (id: string) => {
        const confirmDelete = confirm("Are you sure you want to delete?");
        if (!confirmDelete) return;

        try {
            await axios.delete(`${API}/${id}`);
            window.location.reload(); // quick refresh
        } catch (err) {
            console.error("Delete error:", err);
        }
    };

    // ✅ SEARCH FILTER
    const filteredJobs = useMemo(() => {
        return jobs?.filter((job: any) =>
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

    // ✅ PAGINATION LOGIC
    const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);

    const paginatedJobs = filteredJobs.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="p-6">

            <h1 className="text-2xl font-semibold mb-4">Jobs List</h1>

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

                                    <td className="p-2 border">{job.jobId || "-"}</td>
                                    <td className="p-2 border">{job.jobDetail?.customerName || "-"}</td>
                                    <td className="p-2 border">{job.jobDetail?.jobName || "-"}</td>
                                    <td className="p-2 border">{job.jobDetail?.poNumber || "-"}</td>
                                    <td className="p-2 border">{job.contactDetails?.mobile || "-"}</td>

                                    {/* 🎨 STATUS */}
                                    <td className="p-2 border">
                                        <span className={`px-2 py-1 text-xs rounded ${getStatusColor(job.status)}`}>
                                            {job.status || "NEW"}
                                        </span>
                                    </td>

                                    {/* ⚙️ ACTIONS */}
                                    <td className="p-2 border text-center space-x-2">
                                        <button
                                            onClick={() => router.push(`/jobs/edit/${job._id}`)}
                                            className="px-3 py-1 text-xs bg-blue-500 text-white rounded"
                                        >
                                            Edit
                                        </button>

                                        <button
                                            onClick={() => handleDelete(job._id)}
                                            className="px-3 py-1 text-xs bg-red-500 text-white rounded"
                                        >
                                            Delete
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

        </div>
    );
}