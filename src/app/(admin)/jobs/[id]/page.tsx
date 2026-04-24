"use client";

import { useEffect, useState } from "react";
import { getJobById } from "@/services/jobService";
import { useParams } from "next/navigation";

export default function JobDetail() {
  const { id } = useParams();
  const [job, setJob] = useState<any>(null);

  useEffect(() => {
    if (id) {
      getJobById(id as string).then(res => setJob(res.data));
    }
  }, [id]); // ✅ FIX

  if (!job) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">{job.jobId}</h1>
      <p>{job.jobDetail?.customerName}</p>
      <p>{job.jobDetail?.jobName}</p>
    </div>
  );
}