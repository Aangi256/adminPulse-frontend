"use client";

import { useEffect, useState } from "react";
import { getJobs } from "@/services/jobService";
import JobCard from "./JobCard";
import Link from "next/link";

export default function JobList() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await getJobs();
        console.log("Jobs API Response:", data);
        setJobs(data);
      } catch (err) {
        console.error("Error fetching jobs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // ✅ LOADING
  if (loading) {
    return <div className="p-4">Loading jobs...</div>;
  }

  // ✅ EMPTY STATE
  if (jobs.length === 0) {
    return (
      <div className="p-4">
        <p className="text-gray-500 mb-4">
          No jobs found. Create a new job.
        </p>

        <Link
          href="/jobs/create"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          + Create Job
        </Link>
      </div>
    );
  }

  // ✅ DATA STATE
  return (
    <div className="p-4">
      {/* Top Button */}
      <div className="mb-4">
        <Link
          href="/jobs/create"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          + Create Job
        </Link>
      </div>

      {jobs.map((job: any) => (
        <JobCard key={job._id} job={job} />
      ))}
    </div>
  );
}