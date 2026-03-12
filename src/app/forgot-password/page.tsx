"use client";

import React, { useState } from "react";
import axios from "axios";

export default function ForgotPassword() {

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e:any) => {

    e.preventDefault();

    try {

      const res = await axios.post(
        "http://localhost:5000/api/v1/auth/forgot-password",
        { email }
      );

      setMessage(res.data.message);

    } catch (err:any) {

      setMessage(
        err.response?.data?.message || "Something went wrong"
      );

    }
  };

  return (

    <div className="max-w-md mx-auto mt-20">

      <h2 className="text-xl font-semibold mb-4">
        Forgot Password
      </h2>

      <form onSubmit={handleSubmit}>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          className="w-full border p-3 rounded-lg mb-3"
        />

        <button className="w-full bg-indigo-600 text-white p-3 rounded-lg">
          Send Reset Link
        </button>

      </form>

      {message && <p className="mt-3">{message}</p>}

    </div>

  );

}