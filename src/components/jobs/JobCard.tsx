import Link from "next/link";

export default function JobCard({ job }: any) {
  return (
    <Link href={`/jobs/${job._id}`}>
      <div className="border p-4 m-2 cursor-pointer">
        <h3>{job.jobId}</h3>
        <p>{job.customerName}</p>
        <p>Status: {job.status}</p>
      </div>
    </Link>
  );
}