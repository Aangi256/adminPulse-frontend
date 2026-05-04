import axios from "axios";

const BASE = "http://localhost:5000/api/v1/users";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/** Fetch all users for job assignment; optionally filter by ?role=Designer */
export const getUsersForAssignment = async (role?: string) => {
  const params = role ? { role } : {};
  const res = await axios.get(`${BASE}/assign`, {
    params,
    headers: getAuthHeader(),
  });
  return res.data.users as { _id: string; fullName: string; email: string }[];
};

/** Fetch all users (admin) */
export const getAllUsers = async () => {
  const res = await axios.get(BASE, { headers: getAuthHeader() });
  return res.data.users;
};
