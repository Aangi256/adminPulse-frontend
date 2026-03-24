"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function UserList({ setSelectedChat , setSelectedUser }: any) {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  const fetchUsers = async () => {
    if (!token) return;

    try {
      const res = await axios.get("http://localhost:5000/api/v1/users/search?search=" + search,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("USER API RESPONSE:", res.data);

      setUsers(res.data.users || res.data || []);
    } catch (err) {
      console.log("User fetch error:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search, token]);

  const accessChat = async (user: any) => {
  try {
    const res = await axios.post(
      "http://localhost:5000/api/chat",
      { userId: user._id },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setSelectedChat(res.data);
    setSelectedUser(user); 
  } catch (err) {
    console.log("Chat access error:", err);
  }
};

  return (
    <div className="w-1/3 border-r p-3">
      <input
        type="text"
        placeholder="Search user..."
        className="w-full p-2 border mb-3"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {users.length === 0 ? (
        <div>No users found</div>
      ) : (
        users.map((user: any) => (
          <div
            key={user._id}
            className="p-2 cursor-pointer hover:bg-gray-200 rounded"
            onClick={() => accessChat(user)}
          >
            {user.fullName}
          </div>
        ))
      )}
    </div>
  );
}