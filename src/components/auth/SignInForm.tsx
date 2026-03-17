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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();

    setError("");

    try {

      const res = await axios.post(
        "http://localhost:5000/api/v1/auth/login",
        formData
      );

      console.log("Login Response:", res.data);

      if (res.data.success) {

        const token = res.data.token;
        const user = res.data.user;

        // store login data
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        // redirect to dashboard
        router.push("/");

      }

    } catch (err: any) {

      console.error("Login Error:", err);

      if (err.response?.status === 401) {

        setError("Invalid email or password");

      } else {

        setError(err.response?.data?.message || "Login failed");

      }

    }

  };

  return (

    <form onSubmit={handleSubmit} className="space-y-5">

      <div>
        <label>Email</label>

        <input
          type="email"
          name="email"
          placeholder="info@gmail.com"
          value={formData.email}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg"
          required
        />

      </div>

      <div>
        <label>Password</label>

        <input
          type="password"
          name="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg"
          required
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