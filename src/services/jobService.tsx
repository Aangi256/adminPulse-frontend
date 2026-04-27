import axios from "axios";

const API = "http://localhost:5000/api/jobs";

export const createJob = async (form: any, file: any) => {
  try {
    const formData = new FormData();
    formData.append("data", JSON.stringify(form)); // ✅ backend reads req.body.data
    if (file) formData.append("file", file);

    // ✅ No Content-Type header — axios sets boundary automatically
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