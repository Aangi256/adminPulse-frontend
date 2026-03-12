"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");


    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  function toggleDropdown(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/signin");
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center text-gray-700 dark:text-gray-400 dropdown-toggle"
      >
        <span className="mr-3 overflow-hidden rounded-full h-11 w-11">
          <Image
            width={50}
            height={50}
            // className="object-cover rounded-full"
            src={
              user?.image
                ? `http://localhost:5000/uploads/${user.image}`
                : "/tailadmin-nextjs/images/user/owner.jpg"
            }
            alt="User"
          />
        </span>

        <span className="block mr-1 font-medium text-theme-sm">
          {user?.fullName || "User"}
        </span>

        <svg
          className={`stroke-gray-500 dark:stroke-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""
            }`}
          width="18"
          height="20"
          viewBox="0 0 18 20"
        >
          <path
            d="M4.3125 8.65625L9 13.3437L13.6875 8.65625"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute right-0 mt-[17px] flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark"
      >
        <div>
          <span className="block font-medium text-gray-700 text-theme-sm dark:text-gray-400">
            {user?.fullName || "User"}
          </span>

          <span className="mt-0.5 block text-theme-xs text-gray-500 dark:text-gray-400">
            {user?.email || "email@example.com"}
          </span>
        </div>

        <ul className="flex flex-col gap-1 pt-4 pb-3 border-b border-gray-200 dark:border-gray-800">
          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              tag="a"
              href="/profile"
              className="px-3 py-2 rounded-lg hover:bg-gray-100"
            >
              Edit profile
            </DropdownItem>
          </li>

          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              tag="a"
              href="/profile"
              className="px-3 py-2 rounded-lg hover:bg-gray-100"
            >
              Account settings
            </DropdownItem>
          </li>

          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              tag="a"
              href="/profile"
              className="px-3 py-2 rounded-lg hover:bg-gray-100"
            >
              Support
            </DropdownItem>
          </li>
        </ul>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 mt-3 font-medium text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5"
        >
          Sign out
        </button>
      </Dropdown>
    </div>
  );
}