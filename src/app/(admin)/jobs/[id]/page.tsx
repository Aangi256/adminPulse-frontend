import axios from "axios";
import JobDetails from "@/components/jobs/JobDetails";

async function getJob(id: string) {
  const res = await axios.get(
    `http://localhost:5000/api/jobs`
  );

  return res.data.find((j: any) => j._id === id);
}

export default async function Page({ params }: any) {
  const job = await getJob(params.id);

  return <JobDetails job={job} />;
}