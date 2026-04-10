"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ChatPage from "@/components/chat/ChatPage";

export default function Page() {

  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    console.log("CHAT PAGE ROLE:", role);

    // ✅ If not logged in → block
    if (!token) {
      router.replace("/signin");
      return;
    }

    // ✅ Allow both Admin & User
    if (!role) {
      router.replace("/signin");
      return;
    }

    setLoading(false);

  }, []);

  if (loading) {
    return <div className="p-6">Loading Chat...</div>;
  }

  return <ChatPage />;
}