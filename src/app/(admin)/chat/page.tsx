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

    if (!token || !role) {
      router.replace("/signin");
      return;
    }

    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <ChatPage />;
}
