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
  const [unreadChatCount, setUnreadChatCount] = useState(0);

  const socketRef = useRef<Socket | null>(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    setNotifying(false);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  // ─────────────────────────────────────────
  // ✅ FETCH EXISTING NOTIFICATIONS
  // ─────────────────────────────────────────
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/notifications");
        setNotifications(res.data);

        if (res.data.length > 0) {
          setNotifying(true);
        }
      } catch (error) {
        console.error("Notification fetch error:", error);
      }
    };

    fetchNotifications();
  }, []);

  // ─────────────────────────────────────────
  // ✅ SOCKET CONNECTION
  // ─────────────────────────────────────────
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    const socket = io("http://localhost:5000", {
      transports: ["websocket"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("setup", userId);
    });

    // ✅ Real-time notification (MAIN FIX)
    socket.on("new notification", (notif: Notification) => {
      setNotifications((prev) => [notif, ...prev]);
      setNotifying(true);
    });

    // ✅ Chat badge only (no duplication)
    socket.on("message received", () => {
      const isChatPage = window.location.pathname.startsWith("/chat");

      if (!isChatPage) {
        setUnreadChatCount((prev) => prev + 1);
        setNotifying(true);
      }
    });

    // ── Load unread count from API
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

          if (total > 0) {
            setNotifying(true);
          }
        })
        .catch(() => {});
    }

    return () => {
      socket.disconnect();
    };
  }, []);

  // ✅ FINAL BADGE COUNT (ONLY NOTIFICATIONS)
  const totalBadge = notifications.length;

  return (
    <div className="relative">
      {/* 🔔 ICON */}
      <button
        onClick={toggleDropdown}
        className="relative flex items-center justify-center text-gray-500 bg-white border rounded-full h-11 w-11 hover:bg-gray-100"
      >
        {/* ✅ Badge */}
        {notifying && totalBadge > 0 && (
          <span className="absolute -right-1 -top-1 z-10 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
            {totalBadge > 99 ? "99+" : totalBadge}
          </span>
        )}

        {/* Bell */}
        <svg width="20" height="20" viewBox="0 0 20 20" className="fill-current">
          <path d="M10 2a6 6 0 00-6 6v5H3a1 1 0 000 2h14a1 1 0 000-2h-1V8a6 6 0 00-6-6z" />
        </svg>
      </button>

      {/* ───────────────────────────────────────── */}
      {/* 📦 DROPDOWN */}
      {/* ───────────────────────────────────────── */}
      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute right-0 mt-3 w-[350px] h-[480px] flex flex-col rounded-2xl border bg-white p-3 shadow-lg"
      >
        {/* HEADER */}
        <div className="flex items-center justify-between mb-3 border-b pb-2">
          <h5 className="text-lg font-semibold">Notifications</h5>

          <button onClick={closeDropdown}>✕</button>
        </div>

        {/* LIST */}
        <ul className="flex flex-col overflow-y-auto">
          {notifications.length === 0 && unreadChatCount === 0 ? (
            <p className="text-center text-gray-500 py-5">
              No Notifications
            </p>
          ) : (
            <>
              {/* ✅ CHAT BANNER */}
              {unreadChatCount > 0 && (
                <li>
                  <Link
                    href="/chat"
                    onClick={closeDropdown}
                    className="flex gap-3 p-3 bg-blue-50 rounded-lg border mb-2"
                  >
                    <span className="w-10 h-10 flex items-center justify-center bg-blue-500 rounded-full text-white">
                      💬
                    </span>

                    <span>
                      <p className="text-sm font-medium text-blue-700">
                        {unreadChatCount} unread message
                        {unreadChatCount > 1 ? "s" : ""}
                      </p>
                      <p className="text-xs text-blue-500">
                        Click to open chat
                      </p>
                    </span>
                  </Link>
                </li>
              )}

              {/* ✅ DB NOTIFICATIONS */}
              {notifications.map((item) => (
                <li key={item._id}>
                  <DropdownItem
                    onItemClick={closeDropdown}
                    className="flex gap-3 p-3 border-b hover:bg-gray-100"
                  >
                    <Image
                      src={item.image || "/default-user.png"}
                      alt="user"
                      width={40}
                      height={40}
                      className="rounded-full"
                    />

                    <div>
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold text-gray-800">
                          {item.user}
                        </span>{" "}
                        {item.message}
                      </p>

                      <span className="text-xs text-gray-400">
                        {new Date(item.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </DropdownItem>
                </li>
              ))}
            </>
          )}
        </ul>

        {/* FOOTER */}
        <Link
          href="/notifications"
          className="mt-3 text-center text-sm border rounded-lg py-2 hover:bg-gray-100"
        >
          View All Notifications
        </Link>
      </Dropdown>
    </div>
  );
}