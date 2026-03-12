"use client";

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function SignInForm() {

  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {

    const response = await axios.post(
      "http://localhost:5000/api/v1/auth/login",
      formData
    );

    if (response.data.success) {

      const token = response.data.token;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      document.cookie = `token=${token}; path=/`;

      router.push("/");

    }

  } catch (error: any) {

    console.log(error);
    alert(error.response?.data?.message || "Login failed");

  }
};
  return (

    <form onSubmit={handleSubmit} className="space-y-5">

      {/* Email */}
      <div>

        <label>Email</label>

        <input
          type="email"
          name="email"
          placeholder="info@gmail.com"
          value={formData.email}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg"
        />

      </div>

      {/* Password */}
      <div>

        <label>Password</label>

        <input
          type="password"
          name="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg"
        />

      </div>

      <div className="text-right">
        <button
          type="button"
          onClick={() => router.push("/forgot-password")}
          className="text-sm text-indigo-600"
        >
          Forgot Password?
        </button>
      </div>

      {error && (
        <p className="text-red-500 text-sm">
          {error}
        </p>
      )}

      <button
        type="submit"
        className="w-full bg-indigo-600 text-white p-3 rounded-lg"
      >
        Sign In
      </button>

    </form>
  );
}