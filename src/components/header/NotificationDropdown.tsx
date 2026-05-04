"use client";

import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import io, { Socket } from "socket.io-client";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";

interface Notification {
  _id: string;
  user: string;
  message: string;
  project: string;
  type: string;         // "chat" | "job"
  image?: string;
  chatId?: string | { _id: string };
  jobId?: string | { _id: string };
  read: boolean;
  createdAt: string;
}

const API = "http://localhost:5000/api/notifications";

const authHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const getStoredUserId = () => {
  const userId = localStorage.getItem("userId");
  if (userId) return userId;

  const user = localStorage.getItem("user");
  if (!user) return null;

  try {
    return JSON.parse(user).id || null;
  } catch {
    return null;
  }
};

const getRefId = (value?: string | { _id: string }) => {
  if (!value) return "";
  return typeof value === "string" ? value : value._id;
};

const getImageSrc = (image?: string) => {
  if (!image) return "/default-user.png";
  if (image.startsWith("http") || image.startsWith("/")) return image;
  return `http://localhost:5000/uploads/${image}`;
};

export default function NotificationDropdown() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const socketRef = useRef<Socket | null>(null);

  const closeDropdown = () => setIsOpen(false);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(API, { headers: authHeader() });
      setNotifications(res.data || []);
    } catch (error) {
      console.error("Notification fetch error:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    const userId = getStoredUserId();
    if (!userId) return;

    const socket = io("http://localhost:5000", {
      transports: ["websocket"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("setup", userId);
    });

    socket.on("new notification", (notif: Notification) => {
      setNotifications((prev) => {
        if (prev.some((item) => item._id === notif._id)) return prev;
        return [notif, ...prev];
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleNotificationClick = async (notification: Notification) => {
    // ✅ Step 1: Immediately remove from local state (optimistic UI)
    setNotifications((prev) => prev.filter((item) => item._id !== notification._id));
    closeDropdown();

    // ✅ Step 2: Persist "read" in the backend so it won't come back on next fetch
    try {
      await axios.put(`${API}/${notification._id}`, {}, { headers: authHeader() });
    } catch (error) {
      console.error("Mark notification read error:", error);
    }

    // ✅ Step 3: Redirect based on notification type
    const chatId = getRefId(notification.chatId);
    const jobId  = getRefId(notification.jobId);

    if (notification.type === "chat" && chatId) {
      router.push(`/chat?chatId=${chatId}`);
      return;
    }

    if (notification.type === "chat") {
      router.push("/chat");
      return;
    }

    if (notification.type === "job") {
      const userRole = localStorage.getItem("role");
      if (userRole === "Admin") {
        router.push("/jobs/list");
      } else {
        router.push("/");
      }
      return;
    }

    // Fallback for any other type
    router.push("/");
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen((value) => !value)}
        className="relative flex h-11 w-11 items-center justify-center rounded-full border bg-white text-gray-500 hover:bg-gray-100"
        aria-label="Notifications"
      >
        {notifications.length > 0 && (
          <span className="absolute -right-1 -top-1 z-10 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            {notifications.length > 99 ? "99+" : notifications.length}
          </span>
        )}

        <svg width="20" height="20" viewBox="0 0 20 20" className="fill-current">
          <path d="M10 2a6 6 0 00-6 6v5H3a1 1 0 000 2h14a1 1 0 000-2h-1V8a6 6 0 00-6-6z" />
        </svg>
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute right-0 mt-3 flex h-[480px] w-[350px] flex-col rounded-2xl border bg-white p-3 shadow-lg"
      >
        <div className="mb-3 flex items-center justify-between border-b pb-2">
          <h5 className="text-lg font-semibold">Notifications</h5>
          <button onClick={closeDropdown} className="text-gray-500 hover:text-gray-800">
            x
          </button>
        </div>

        <ul className="flex flex-col overflow-y-auto">
          {notifications.length === 0 ? (
            <li className="py-5 text-center text-gray-500">No Notifications</li>
          ) : (
            notifications.map((item) => (
              <li key={item._id}>
                <DropdownItem
                  onClick={() => handleNotificationClick(item)}
                  className="flex gap-3 border-b p-3 hover:bg-gray-100"
                >
                  <Image
                    src={getImageSrc(item.image)}
                    alt="notification"
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-full object-cover"
                  />

                  <div className="min-w-0">
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold text-gray-800">{item.user}</span>{" "}
                      {item.message}
                    </p>
                    <span className="text-xs text-gray-400">
                      {new Date(item.createdAt).toLocaleString()}
                    </span>
                  </div>
                </DropdownItem>
              </li>
            ))
          )}
        </ul>
      </Dropdown>
    </div>
  );
}
