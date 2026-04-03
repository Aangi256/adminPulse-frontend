import axios from "axios";

const API = "http://localhost:5000/api/jobs";

const getAuthHeaders = () => {
  if (typeof window === "undefined") return {};

  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getJobs = async () => {
  try {
    const res = await axios.get(API, getAuthHeaders());
    return res.data;
  } catch (error: any) {
    console.error("GET JOBS ERROR:", error.response || error);
    throw error;
  }
};

export const createJob = async (data: any) => {
  const res = await axios.post(API, data, getAuthHeaders());
  return res.data;
};

export const updateStatus = async (id: string) => {
  const res = await axios.put(
    `${API}/${id}/status`,
    {},
    getAuthHeaders()
  );
  return res.data;
};