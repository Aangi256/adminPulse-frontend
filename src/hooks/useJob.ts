import { useEffect, useState } from "react";
import { getJobs } from "@/services/jobService";

export const useJobs = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    getJobs().then(res => setJobs(res.data));
  }, []);

  return jobs;
};