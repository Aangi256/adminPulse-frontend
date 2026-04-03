"use client";

import { updateStatus } from "@/services/jobService";

export default function StatusButton({ id }: any) {
  const handleClick = async () => {
    try {
      const res = await updateStatus(id);

      console.log("Status Updated:", res); 

      alert("Status Updated");

      window.location.href = "/jobs";

    } catch (err: any) {
      console.error("Status Update Error:", err);
      alert("Error updating status");
    }
  };

  return (
    <button
      onClick={handleClick}
      className="bg-green-500 text-white p-2 mt-2"
    >
      Move to Next Stage
    </button>
  );
}