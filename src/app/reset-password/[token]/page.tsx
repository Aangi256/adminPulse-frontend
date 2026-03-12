"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";

export default function ResetPassword() {

  const params = useParams();
  const router = useRouter();

  const token = params.token as string;

  const [password, setPassword] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      await axios.post(
        `http://localhost:5000/api/v1/auth/reset-password/${token}`,
        { password }
      );

      alert("Password reset successfully");

      // redirect to login page
      router.push("/signin");

    } catch (error) {
      console.error(error);
      alert("Reset failed");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Reset Password</h2>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />

          <button type="submit" style={styles.button}>
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}

const styles: any = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f5f6fa",
  },
  card: {
    background: "white",
    padding: "40px",
    borderRadius: "10px",
    boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
    width: "350px",
    textAlign: "center",
  },
  title: {
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  input: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "14px",
  },
  button: {
    padding: "10px",
    borderRadius: "6px",
    border: "none",
    background: "#4f46e5",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
  },
};