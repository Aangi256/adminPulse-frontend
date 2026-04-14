// "use client";
// import Image from "next/image";
// import Link from "next/link";
// import React, { useState } from "react";
// import { Dropdown } from "../ui/dropdown/Dropdown";
// import { DropdownItem } from "../ui/dropdown/DropdownItem";

// export default function NotificationDropdown() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [notifying, setNotifying] = useState(true);

//   function toggleDropdown() {
//     setIsOpen(!isOpen);
//   }

//   function closeDropdown() {
//     setIsOpen(false);
//   }

//   const handleClick = () => {
//     toggleDropdown();
//     setNotifying(false);
//   };
//   return (
//     <div className="relative">
//       <button
//         className="relative dropdown-toggle flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full hover:text-gray-700 h-11 w-11 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
//         onClick={handleClick}
//       >
//         <span
//           className={`absolute right-0 top-0.5 z-10 h-2 w-2 rounded-full bg-orange-400 ${
//             !notifying ? "hidden" : "flex"
//           }`}
//         >
//           <span className="absolute inline-flex w-full h-full bg-orange-400 rounded-full opacity-75 animate-ping"></span>
//         </span>
//         <svg
//           className="fill-current"
//           width="20"
//           height="20"
//           viewBox="0 0 20 20"
//           xmlns="http://www.w3.org/2000/svg"
//         >
//           <path
//             fillRule="evenodd"
//             clipRule="evenodd"
//             d="M10.75 2.29248C10.75 1.87827 10.4143 1.54248 10 1.54248C9.58583 1.54248 9.25004 1.87827 9.25004 2.29248V2.83613C6.08266 3.20733 3.62504 5.9004 3.62504 9.16748V14.4591H3.33337C2.91916 14.4591 2.58337 14.7949 2.58337 15.2091C2.58337 15.6234 2.91916 15.9591 3.33337 15.9591H4.37504H15.625H16.6667C17.0809 15.9591 17.4167 15.6234 17.4167 15.2091C17.4167 14.7949 17.0809 14.4591 16.6667 14.4591H16.375V9.16748C16.375 5.9004 13.9174 3.20733 10.75 2.83613V2.29248ZM14.875 14.4591V9.16748C14.875 6.47509 12.6924 4.29248 10 4.29248C7.30765 4.29248 5.12504 6.47509 5.12504 9.16748V14.4591H14.875ZM8.00004 17.7085C8.00004 18.1228 8.33583 18.4585 8.75004 18.4585H11.25C11.6643 18.4585 12 18.1228 12 17.7085C12 17.2943 11.6643 16.9585 11.25 16.9585H8.75004C8.33583 16.9585 8.00004 17.2943 8.00004 17.7085Z"
//             fill="currentColor"
//           />
//         </svg>
//       </button>
//       <Dropdown
//         isOpen={isOpen}
//         onClose={closeDropdown}
//         className="absolute -right-[240px] mt-[17px] flex h-[480px] w-[350px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark sm:w-[361px] lg:right-0"
//       >
//         <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100 dark:border-gray-700">
//           <h5 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
//             Notification
//           </h5>
//           <button
//             onClick={toggleDropdown}
//             className="text-gray-500 transition dropdown-toggle dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
//           >
//             <svg
//               className="fill-current"
//               width="24"
//               height="24"
//               viewBox="0 0 24 24"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path
//                 fillRule="evenodd"
//                 clipRule="evenodd"
//                 d="M6.21967 7.28131C5.92678 6.98841 5.92678 6.51354 6.21967 6.22065C6.51256 5.92775 6.98744 5.92775 7.28033 6.22065L11.999 10.9393L16.7176 6.22078C17.0105 5.92789 17.4854 5.92788 17.7782 6.22078C18.0711 6.51367 18.0711 6.98855 17.7782 7.28144L13.0597 12L17.7782 16.7186C18.0711 17.0115 18.0711 17.4863 17.7782 17.7792C17.4854 18.0721 17.0105 18.0721 16.7176 17.7792L11.999 13.0607L7.28033 17.7794C6.98744 18.0722 6.51256 18.0722 6.21967 17.7794C5.92678 17.4865 5.92678 17.0116 6.21967 16.7187L10.9384 12L6.21967 7.28131Z"
//                 fill="currentColor"
//               />
//             </svg>
//           </button>
//         </div>
//         <ul className="flex flex-col h-auto overflow-y-auto custom-scrollbar">
//           {/* Example notification items */}
//           <li>
//             <DropdownItem
//               onItemClick={closeDropdown}
//               className="flex gap-3 rounded-lg border-b border-gray-100 p-3 px-4.5 py-3 hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-white/5"
//             >
//               <span className="relative block w-full h-10 rounded-full z-1 max-w-10">
//                 <Image
//                   width={40}
//                   height={40}
//                   src="/tailadmin-nextjs/images/user/user-02.jpg"
//                   alt="User"
//                   className="w-full overflow-hidden rounded-full"
//                 />
//                 <span className="absolute bottom-0 right-0 z-10 h-2.5 w-full max-w-2.5 rounded-full border-[1.5px] border-white bg-success-500 dark:border-gray-900"></span>
//               </span>

//               <span className="block">
//                 <span className="mb-1.5 space-x-1 block text-theme-sm text-gray-500 dark:text-gray-400">
//                   <span className="font-medium text-gray-800 dark:text-white/90">
//                     Terry Franci
//                   </span>
//                   <span>requests permission to change</span>
//                   <span className="font-medium text-gray-800 dark:text-white/90">
//                     Project - Nganter App
//                   </span>
//                 </span>

//                 <span className="flex items-center gap-2 text-gray-500 text-theme-xs dark:text-gray-400">
//                   <span>Project</span>
//                   <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
//                   <span>5 min ago</span>
//                 </span>
//               </span>
//             </DropdownItem>
//           </li>

//           <li>
//             <DropdownItem
//               onItemClick={closeDropdown}
//               className="flex gap-3 rounded-lg border-b border-gray-100 p-3 px-4.5 py-3 hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-white/5"
//             >
//               <span className="relative block w-full h-10 rounded-full z-1 max-w-10">
//                 <Image
//                   width={40}
//                   height={40}
//                   src="/tailadmin-nextjs/images/user/user-03.jpg"
//                   alt="User"
//                   className="w-full overflow-hidden rounded-full"
//                 />
//                 <span className="absolute bottom-0 right-0 z-10 h-2.5 w-full max-w-2.5 rounded-full border-[1.5px] border-white bg-success-500 dark:border-gray-900"></span>
//               </span>

//               <span className="block">
//                 <span className="mb-1.5 block space-x-1  text-theme-sm text-gray-500 dark:text-gray-400">
//                   <span className="font-medium text-gray-800 dark:text-white/90">
//                     Alena Franci
//                   </span>
//                   <span> requests permission to change</span>
//                   <span className="font-medium text-gray-800 dark:text-white/90">
//                     Project - Nganter App
//                   </span>
//                 </span>

//                 <span className="flex items-center gap-2 text-gray-500 text-theme-xs dark:text-gray-400">
//                   <span>Project</span>
//                   <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
//                   <span>8 min ago</span>
//                 </span>
//               </span>
//             </DropdownItem>
//           </li>

//           <li>
//             <DropdownItem
//               onItemClick={closeDropdown}
//               className="flex gap-3 rounded-lg border-b border-gray-100 p-3 px-4.5 py-3 hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-white/5"
//               href="#"
//             >
//               <span className="relative block w-full h-10 rounded-full z-1 max-w-10">
//                 <Image
//                   width={40}
//                   height={40}
//                   src="/tailadmin-nextjs/images/user/user-04.jpg"
//                   alt="User"
//                   className="w-full overflow-hidden rounded-full"
//                 />
//                 <span className="absolute bottom-0 right-0 z-10 h-2.5 w-full max-w-2.5 rounded-full border-[1.5px] border-white bg-success-500 dark:border-gray-900"></span>
//               </span>

//               <span className="block">
//                 <span className="mb-1.5 block space-x-1 text-theme-sm text-gray-500 dark:text-gray-400">
//                   <span className="font-medium text-gray-800 dark:text-white/90">
//                     Jocelyn Kenter
//                   </span>
//                   <span>requests permission to change</span>
//                   <span className="font-medium text-gray-800 dark:text-white/90">
//                     Project - Nganter App
//                   </span>
//                 </span>

//                 <span className="flex items-center gap-2 text-gray-500 text-theme-xs dark:text-gray-400">
//                   <span>Project</span>
//                   <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
//                   <span>15 min ago</span>
//                 </span>
//               </span>
//             </DropdownItem>
//           </li>

//           <li>
//             <DropdownItem
//               onItemClick={closeDropdown}
//               className="flex gap-3 rounded-lg border-b border-gray-100 p-3 px-4.5 py-3 hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-white/5"
//               href="#"
//             >
//               <span className="relative block w-full h-10 rounded-full z-1 max-w-10">
//                 <Image
//                   width={40}
//                   height={40}
//                   src="/tailadmin-nextjs/images/user/user-05.jpg"
//                   alt="User"
//                   className="w-full overflow-hidden rounded-full"
//                 />
//                 <span className="absolute bottom-0 right-0 z-10 h-2.5 w-full max-w-2.5 rounded-full border-[1.5px] border-white bg-error-500 dark:border-gray-900"></span>
//               </span>

//               <span className="block">
//                 <span className="mb-1.5 space-x-1 block text-theme-sm text-gray-500 dark:text-gray-400">
//                   <span className="font-medium text-gray-800 dark:text-white/90">
//                     Brandon Philips
//                   </span>
//                   <span> requests permission to change</span>
//                   <span className="font-medium text-gray-800 dark:text-white/90">
//                     Project - Nganter App
//                   </span>
//                 </span>

//                 <span className="flex items-center gap-2 text-gray-500 text-theme-xs dark:text-gray-400">
//                   <span>Project</span>
//                   <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
//                   <span>1 hr ago</span>
//                 </span>
//               </span>
//             </DropdownItem>
//           </li>

//           <li>
//             <DropdownItem
//               className="flex gap-3 rounded-lg border-b border-gray-100 p-3 px-4.5 py-3 hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-white/5"
//               onItemClick={closeDropdown}
//             >
//               <span className="relative block w-full h-10 rounded-full z-1 max-w-10">
//                 <Image
//                   width={40}
//                   height={40}
//                   src="/tailadmin-nextjs/images/user/user-02.jpg"
//                   alt="User"
//                   className="w-full overflow-hidden rounded-full"
//                 />
//                 <span className="absolute bottom-0 right-0 z-10 h-2.5 w-full max-w-2.5 rounded-full border-[1.5px] border-white bg-success-500 dark:border-gray-900"></span>
//               </span>

//               <span className="block">
//                 <span className="mb-1.5 space-x-1 block text-theme-sm text-gray-500 dark:text-gray-400">
//                   <span className="font-medium text-gray-800 dark:text-white/90">
//                     Terry Franci
//                   </span>
//                   <span>requests permission to change</span>
//                   <span className="font-medium text-gray-800 dark:text-white/90">
//                     Project - Nganter App
//                   </span>
//                 </span>

//                 <span className="flex items-center gap-2 text-gray-500 text-theme-xs dark:text-gray-400">
//                   <span>Project</span>
//                   <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
//                   <span>5 min ago</span>
//                 </span>
//               </span>
//             </DropdownItem>
//           </li>

//           <li>
//             <DropdownItem
//               onItemClick={closeDropdown}
//               className="flex gap-3 rounded-lg border-b border-gray-100 p-3 px-4.5 py-3 hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-white/5"
//             >
//               <span className="relative block w-full h-10 rounded-full z-1 max-w-10">
//                 <Image
//                   width={40}
//                   height={40}
//                   src="/tailadmin-nextjs/images/user/user-03.jpg"
//                   alt="User"
//                   className="w-full overflow-hidden rounded-full"
//                 />
//                 <span className="absolute bottom-0 right-0 z-10 h-2.5 w-full max-w-2.5 rounded-full border-[1.5px] border-white bg-success-500 dark:border-gray-900"></span>
//               </span>

//               <span className="block">
//                 <span className="mb-1.5 space-x-1 block text-theme-sm text-gray-500 dark:text-gray-400">
//                   <span className="font-medium text-gray-800 dark:text-white/90">
//                     Alena Franci
//                   </span>
//                   <span>requests permission to change</span>
//                   <span className="font-medium text-gray-800 dark:text-white/90">
//                     Project - Nganter App
//                   </span>
//                 </span>

//                 <span className="flex items-center gap-2 text-gray-500 text-theme-xs dark:text-gray-400">
//                   <span>Project</span>
//                   <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
//                   <span>8 min ago</span>
//                 </span>
//               </span>
//             </DropdownItem>
//           </li>

//           <li>
//             <DropdownItem
//               onItemClick={closeDropdown}
//               className="flex gap-3 rounded-lg border-b border-gray-100 p-3 px-4.5 py-3 hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-white/5"
//             >
//               <span className="relative block w-full h-10 rounded-full z-1 max-w-10">
//                 <Image
//                   width={40}
//                   height={40}
//                   src="/tailadmin-nextjs/images/user/user-04.jpg"
//                   alt="User"
//                   className="w-full overflow-hidden rounded-full"
//                 />
//                 <span className="absolute bottom-0 right-0 z-10 h-2.5 w-full max-w-2.5 rounded-full border-[1.5px] border-white bg-success-500 dark:border-gray-900"></span>
//               </span>

//               <span className="block">
//                 <span className="mb-1.5 space-x-1 block text-theme-sm text-gray-500 dark:text-gray-400">
//                   <span className="font-medium text-gray-800 dark:text-white/90">
//                     Jocelyn Kenter
//                   </span>
//                   <span>requests permission to change</span>
//                   <span className="font-medium text-gray-800 dark:text-white/90">
//                     Project - Nganter App
//                   </span>
//                 </span>

//                 <span className="flex items-center gap-2 text-gray-500 text-theme-xs dark:text-gray-400">
//                   <span>Project</span>
//                   <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
//                   <span>15 min ago</span>
//                 </span>
//               </span>
//             </DropdownItem>
//           </li>

//           <li>
//             <DropdownItem
//               onItemClick={closeDropdown}
//               className="flex gap-3 rounded-lg border-b border-gray-100 p-3 px-4.5 py-3 hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-white/5"
//               href="#"
//             >
//               <span className="relative block w-full h-10 rounded-full z-1 max-w-10">
//                 <Image
//                   width={40}
//                   height={40}
//                   src="/tailadmin-nextjs/images/user/user-05.jpg"
//                   alt="User"
//                   className="overflow-hidden rounded-full"
//                 />
//                 <span className="absolute bottom-0 right-0 z-10 h-2.5 w-full max-w-2.5 rounded-full border-[1.5px] border-white bg-error-500 dark:border-gray-900"></span>
//               </span>

//               <span className="block">
//                 <span className="mb-1.5 space-x-1 block text-theme-sm text-gray-500 dark:text-gray-400">
//                   <span className="font-medium text-gray-800 dark:text-white/90">
//                     Brandon Philips
//                   </span>
//                   <span>requests permission to change</span>
//                   <span className="font-medium text-gray-800 dark:text-white/90">
//                     Project - Nganter App
//                   </span>
//                 </span>

//                 <span className="flex items-center gap-2 text-gray-500 text-theme-xs dark:text-gray-400">
//                   <span>Project</span>
//                   <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
//                   <span>1 hr ago</span>
//                 </span>
//               </span>
//             </DropdownItem>
//           </li>
//           {/* Add more items as needed */}
//         </ul>
//         <Link
//           href="/"
//           className="block px-4 py-2 mt-3 text-sm font-medium text-center text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
//         >
//           View All Notifications
//         </Link>
//       </Dropdown>
//     </div>
//   );
// }
"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import io, { Socket } from "socket.io-client";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";

interface Notification {
  _id: string;
  user: string;
  message: string;
  project: string;
  type: string;
  image: string;
  createdAt: string;
}

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notifying, setNotifying] = useState(false);
  // ✅ Track total unread chat messages via socket
  const [unreadChatCount, setUnreadChatCount] = useState(0);
  const socketRef = useRef<Socket | null>(null);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  const handleClick = () => {
    toggleDropdown();
    setNotifying(false);
  };

  // ── Fetch regular notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/notifications");
        setNotifications(res.data);
        if (res.data.length > 0) setNotifying(true);
      } catch (error) {
        console.error("Notification fetch error:", error);
      }
    };
    fetchNotifications();
  }, []);

  // ── Listen for new chat messages and update unread badge
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    const socket = io("http://localhost:5000", { transports: ["websocket"] });
    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("setup", userId);
    });

    // When a message comes in and the chat page is NOT open, increment badge
    socket.on("message received", (msg: any) => {
      // Check if the chat page is currently active — if not, increment
      const isChatPageActive = window.location.pathname === "/chat";
      if (!isChatPageActive) {
        setUnreadChatCount((prev) => prev + 1);
        setNotifying(true);
      }
    });

    // ── Also fetch existing unread count on mount
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("http://localhost:5000/api/chat", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          const total = res.data.reduce(
            (acc: number, c: any) => acc + (c.unreadCount || 0),
            0
          );
          setUnreadChatCount(total);
          if (total > 0) setNotifying(true);
        })
        .catch(() => {});
    }

    return () => {
      socket.disconnect();
    };
  }, []);

  const totalBadge = notifications.length + unreadChatCount;

  return (
    <div className="relative">
      {/* Notification Icon */}
      <button
        className="relative dropdown-toggle flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full hover:text-gray-700 h-11 w-11 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
        onClick={handleClick}
      >
        {/* ✅ Badge with count */}
        {notifying && totalBadge > 0 && (
          <span className="absolute -right-1 -top-1 z-10 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
            {totalBadge > 99 ? "99+" : totalBadge}
          </span>
        )}

        {/* Ping dot (when no count but still notifying) */}
        {notifying && totalBadge === 0 && (
          <span className="absolute right-0 top-0.5 z-10 h-2 w-2 rounded-full bg-orange-400 flex">
            <span className="absolute inline-flex w-full h-full bg-orange-400 rounded-full opacity-75 animate-ping" />
          </span>
        )}

        {/* Bell Icon */}
        <svg className="fill-current" width="20" height="20" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10.75 2.29248C10.75 1.87827 10.4143 1.54248 10 1.54248C9.58583 1.54248 9.25004 1.87827 9.25004 2.29248V2.83613C6.08266 3.20733 3.62504 5.9004 3.62504 9.16748V14.4591H3.33337C2.91916 14.4591 2.58337 14.7949 2.58337 15.2091C2.58337 15.6234 2.91916 15.9591 3.33337 15.9591H16.6667C17.0809 15.9591 17.4167 15.6234 17.4167 15.2091C17.4167 14.7949 17.0809 14.4591 16.6667 14.4591H16.375V9.16748C16.375 5.9004 13.9174 3.20733 10.75 2.83613V2.29248Z"
          />
        </svg>
      </button>

      {/* Dropdown */}
      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute -right-[240px] mt-[17px] flex h-[480px] w-[350px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark sm:w-[361px] lg:right-0"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100 dark:border-gray-700">
          <h5 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Notifications
          </h5>
          <div className="flex items-center gap-2">
            {unreadChatCount > 0 && (
              <Link
                href="/chat"
                onClick={closeDropdown}
                className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full hover:bg-blue-600"
              >
                {unreadChatCount} new message{unreadChatCount > 1 ? "s" : ""}
              </Link>
            )}
            <button
              onClick={toggleDropdown}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Notification List */}
        <ul className="flex flex-col h-auto overflow-y-auto custom-scrollbar">
          {notifications.length === 0 && unreadChatCount === 0 ? (
            <p className="text-center text-gray-500 py-5">No Notifications</p>
          ) : (
            <>
              {/* ✅ Chat unread messages banner */}
              {unreadChatCount > 0 && (
                <li>
                  <Link
                    href="/chat"
                    onClick={closeDropdown}
                    className="flex gap-3 rounded-lg border-b border-blue-100 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800 p-3 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                  >
                    <span className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500 flex-shrink-0">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                      </svg>
                    </span>
                    <span className="block">
                      <span className="block text-sm font-medium text-blue-700 dark:text-blue-300">
                        {unreadChatCount} unread message{unreadChatCount > 1 ? "s" : ""}
                      </span>
                      <span className="text-xs text-blue-500">Click to open chat</span>
                    </span>
                  </Link>
                </li>
              )}

              {notifications.map((item) => (
                <li key={item._id}>
                  <DropdownItem
                    onItemClick={closeDropdown}
                    className="flex gap-3 rounded-lg border-b border-gray-100 p-3 hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-white/5"
                  >
                    <span className="relative block h-10 w-10 rounded-full">
                      <Image
                        width={40}
                        height={40}
                        src={item.image || "/default-user.png"}
                        alt="user"
                        className="rounded-full"
                      />
                    </span>
                    <span className="block">
                      <span className="block text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-medium text-gray-800 dark:text-white">
                          {item.user}
                        </span>{" "}
                        {item.message}{" "}
                        <span className="font-medium text-gray-800 dark:text-white">
                          {item.project}
                        </span>
                      </span>
                      <span className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                        <span>{item.type}</span>
                        <span className="w-1 h-1 bg-gray-400 rounded-full" />
                        <span>{new Date(item.createdAt).toLocaleString()}</span>
                      </span>
                    </span>
                  </DropdownItem>
                </li>
              ))}
            </>
          )}
        </ul>

        {/* Footer */}
        <Link
          href="/notifications"
          className="block px-4 py-2 mt-3 text-sm font-medium text-center text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
        >
          View All Notifications
        </Link>
      </Dropdown>
    </div>
  );
}
