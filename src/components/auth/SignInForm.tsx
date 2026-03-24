
// "use client";

// import React, { useState } from "react";
// import axios from "axios";
// import { useRouter } from "next/navigation";

// export default function SignInForm() {

//   const router = useRouter();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const handleSubmit = async (e: any) => {

//     e.preventDefault();

//     try {

//       const res = await axios.post(
//         "http://localhost:5000/api/auth/login",
//         {
//           email,
//           password
//         }
//       );

//       const user = res.data.user;

//       localStorage.setItem("user", JSON.stringify(user));

//       router.push("/dashboard");

//     } catch (error: any) {

//       alert(error.response?.data?.message || "Login Failed");

//     }
//   };

//   return (

//     <form onSubmit={handleSubmit} className="space-y-4">

//       <input
//         type="email"
//         placeholder="Email"
//         className="w-full border p-2"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//       />

//       <input
//         type="password"
//         placeholder="Password"
//         className="w-full border p-2"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//       />

//       <button
//         type="submit"
//         className="w-full bg-blue-600 text-white p-2 rounded"
//       >
//         Sign In
//       </button>

//     </form>

//   );
// }



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

  const handleSubmit = async (e: any) => {

    e.preventDefault();

    try {

      const res = await axios.post("http://localhost:5000/api/v1/auth/login", formData)

      if (res.data.success) {

        // ✅ STORE TOKEN (THIS IS MISSING)
        localStorage.setItem("token", res.data.token);

        // store user
        localStorage.setItem(
          "user",
          JSON.stringify(res.data.user)
        );

        router.replace("/");
      }

    } catch (err: any) {

      setError(
        err.response?.data?.message || "Login Failed"
      );

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