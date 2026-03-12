"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import SignInForm from "@/components/auth/SignInForm";

export default function SignInPage() {

  const router = useRouter();

  useEffect(() => {

    const user = localStorage.getItem("user");

    if (user) {
      router.push("/dashboard");
    }

  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">

      <SignInForm />

    </div>
  );
}