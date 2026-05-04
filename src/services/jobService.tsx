import axios from "axios";

const API = "http://localhost:5000/api/jobs";

export const createJob = async (form: any, file: any) => {
  try {
    const formData = new FormData();
    formData.append("data", JSON.stringify(form));
    if (file) formData.append("file", file);

    const res = await axios.post(`${API}/create`, formData);
    return res.data;
  } catch (error: any) {
    console.error("API ERROR:", error.response?.data || error.message);
    throw error;
  }
};

export const getJobs = () => axios.get(API);
export const getJobById = (id: string) => axios.get(`${API}/${id}`);

export const updateJob = async (id: string, form: any, file: any) => {
  try {
    const formData = new FormData();
    formData.append("data", JSON.stringify(form));
    if (file) formData.append("file", file);
    const res = await axios.put(`${API}/${id}`, formData);
    return res.data;
  } catch (error: any) {
    console.error("API ERROR:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ NEW: Assign a job to a user with a given job role
export const assignJob = async (
  jobId: string,
  userId: string,
  jobRole: "design" | "QC" | "production" | "dispatch"
) => {
  const res = await axios.post(`${API}/${jobId}/assign`, { userId, jobRole });
  return res.data;
};

// ✅ NEW: Fetch non-admin users for the assignment dropdown
export const getNonAdminUsers = async () => {
  const res = await axios.get(`${API}/assign/users`);
  return res.data.users as {
    _id: string;
    fullName: string;
    email: string;
    role?: { name: string };
  }[];
};