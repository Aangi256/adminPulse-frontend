import StatusStepper from "./StatusStepper";
import StatusButton from "./StatusButton";

export default function JobDetails({ job }: any) {
  return (
    <div>
      <h2>{job.jobId}</h2>
      <p>{job.customerName}</p>

      <StatusStepper status={job.status} />

      <StatusButton id={job._id} />
    </div>
  );
}