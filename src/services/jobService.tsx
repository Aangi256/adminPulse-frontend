import axios from "axios";

const API = "http://localhost:5000/api/jobs";

export const createJob = (form: any, file: any) => {
  const data = new FormData();
  data.append("data", JSON.stringify(form));
  if (file) data.append("file", file);

  return axios.post(`${API}/create`, data);
};

export const getJobs = () => axios.get(API);

export const getJobById = (id: string) =>
  axios.get(`${API}/${id}`);