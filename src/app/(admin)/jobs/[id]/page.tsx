"use client";

import { useEffect, useState } from "react";
import { getJobById } from "@/services/jobService";
import { useParams } from "next/navigation";

export default function JobDetail() {
  const { id } = useParams();
  const [job, setJob] = useState<any>(null);

  useEffect(() => {
    getJobById(id as string).then(res => setJob(res.data));
  }, []);

  if (!job) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1>{job.jobId}</h1>
      <p>{job.jobDetail.customerName}</p>
      <p>{job.jobDetail.jobName}</p>
    </div>
  );
}