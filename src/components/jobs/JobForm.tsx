"use client";

import { useState } from "react";
import { createJob } from "@/services/jobService";

export default function JobForm() {
  const [form, setForm] = useState({
    customerName: "",
    mobile: "",
  });

  const handleSubmit = async () => {
    try {
      if (!form.customerName || !form.mobile) {
        alert("Please fill all fields");
        return;
      }

      const res = await createJob(form);

      console.log("Job Created:", res);

      alert("Job Created Successfully");

      window.location.href = "/jobs";

    } catch (err: any) {
      console.error("FULL ERROR:", err);

      alert(
        err?.response?.data?.message ||
        err.message ||
        "Error creating job"
      );
    }
  };

  return (
    <div className="p-4">
      <input
        placeholder="Customer Name"
        className="border p-2 m-2"
        onChange={(e) =>
          setForm({ ...form, customerName: e.target.value })
        }
      />

      <input
        placeholder="Mobile"
        className="border p-2 m-2"
        onChange={(e) =>
          setForm({ ...form, mobile: e.target.value })
        }
      />

      <button
        onClick={handleSubmit}
        className="bg-blue-500 p-2 text-white"
      >
        Create Job
      </button>
    </div>
  );
}