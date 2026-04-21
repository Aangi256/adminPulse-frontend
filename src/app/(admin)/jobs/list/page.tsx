"use client";

import { useJobs } from "@/hooks/useJob";

export default function JobList() {
  const jobs: any[] = useJobs();

  return (
    <div className="p-6">

      <h1 className="text-xl mb-4">Jobs</h1>

      <table className="w-full border">
        <thead>
          <tr>
            <th>Job ID</th>
            <th>Customer</th>
            <th>PO</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {jobs.map(job => (
            <tr key={job._id}>
              <td>{job.jobId}</td>
              <td>{job.jobDetail?.customerName}</td>
              <td>{job.jobDetail?.poNumber}</td>
              <td>{job.status}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}