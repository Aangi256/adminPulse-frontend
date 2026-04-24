import axios from "axios";

const API = "http://localhost:5000/api/jobs";

export const createJob = async (form: any, file: any) => {
  try {
    const data = new FormData();

    data.append("data", JSON.stringify(form));
    if (file) data.append("file", file);

    const res = await axios.post(`${API}/create`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;

  } catch (error: any) {
    console.error("API ERROR:", error.response?.data);
    throw error;
  }
};

export const getJobs = () => axios.get(API);

export const getJobById = (id: string) =>
  axios.get(`${API}/${id}`);