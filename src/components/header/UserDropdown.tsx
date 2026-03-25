"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";

export default function UserDropdown() {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("user");

        if (!userData || !token) return;

        const parsedUser = JSON.parse(userData);

        // ✅ HANDLE _id + id both
        const userId =
          parsedUser?.id ||
          parsedUser?._id ||
          parsedUser?.user?.id ||
          parsedUser?.user?._id;

        console.log("User ID:", userId);

        if (!userId) {
          console.error("User ID is undefined ❌");
          return;
        }

        const res = await axios.get(
          `http://localhost:5000/api/v1/users/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUser(res.data.user);
      } catch (error) {
        console.error("User fetch error", error);
      }
    };

    fetchUser();
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/signin");
  };

  return (
    <div className="relative">
      <button onClick={toggleDropdown} className="flex items-center gap-2">
        <span className="h-11 w-11 rounded-full overflow-hidden">
          <Image
            width={44}
            height={44}
            className="object-cover rounded-full"
            src={
              user?.image
                ? `http://localhost:5000/uploads/${user.image}`
                : "/images/user/owner.jpg"
            }
            alt="User"
          />
        </span>

        <span className="font-medium">{user?.fullName || "User"}</span>
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        className="absolute right-0 mt-4 w-[260px] rounded-xl border bg-white p-4 shadow-lg"
      >
        <div>
          <p className="font-medium">{user?.fullName || "User"}</p>
          <p className="text-sm text-gray-500">{user?.email || ""}</p>
        </div>

        <ul className="mt-4 border-t pt-3">
          <li>
            <DropdownItem
              tag="a"
              href="/profile"
              className="block px-3 py-2 hover:bg-gray-100 rounded"
            >
              Profile
            </DropdownItem>
          </li>
        </ul>

        <button
          onClick={handleLogout}
          className="mt-4 w-full text-left px-3 py-2 hover:bg-gray-100 rounded"
        >
          Sign out
        </button>
      </Dropdown>
    </div>
  );
}