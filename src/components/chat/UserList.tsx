"use client";

import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Image from "next/image";

// ── Shape returned by GET /api/chat
interface UserWithChat {
  user: {
    _id: string;
    fullName: string;
    image?: string;
  };
  chat: {
    _id: string;
    users: { _id: string; fullName: string; image?: string }[];
    latestMessage?: {
      content: string;
      sender: { fullName: string };
      createdAt: string;
    };
    unreadCount?: number;
    updatedAt?: string;
  } | null; // null = no conversation yet
}

interface Props {
  socket: any;
  onlineUsers: string[];
  initialChatId?: string | null;
  selectedChat: any;
  setSelectedChat: (chat: any) => void;
  setSelectedUser: (user: any) => void;
  totalUnread: number;
  setTotalUnread: (n: number) => void;
}

export default function UserList({
  socket,
  onlineUsers,
  initialChatId,
  selectedChat,
  setSelectedChat,
  setSelectedUser,
  setTotalUnread,
}: Props) {
  const [search, setSearch] = useState("");
  const [userList, setUserList] = useState<UserWithChat[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [myId, setMyId] = useState<string | null>(null);

  // ── Init token & userId from localStorage
  useEffect(() => {
    const t = localStorage.getItem("token");
    const id = localStorage.getItem("userId");
    setToken(t);
    setMyId(id);
  }, []);

  // ── Fetch all users merged with their chat
  const fetchChats = useCallback(async () => {
    if (!token) return;
    try {
      const res = await axios.get("http://localhost:5000/api/chat", {
        headers: { Authorization: `Bearer ${token}` },
      });
      // res.data is now: [{ user, chat | null }, ...]
      setUserList(res.data);

      // Sum all unread counts from chats that exist
      const total = res.data.reduce(
        (acc: number, item: UserWithChat) => acc + (item.chat?.unreadCount || 0),
        0
      );
      setTotalUnread(total);
    } catch (err) {
      console.error("fetchChats error:", err);
    }
  }, [token]);

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  useEffect(() => {
    if (!initialChatId || selectedChat?._id === initialChatId) return;

    const match = userList.find((item) => item.chat?._id === initialChatId);
    if (!match?.chat) return;

    setSelectedChat(match.chat);
    setSelectedUser(match.user);

    setUserList((prev) =>
      prev.map((item) =>
        item.chat?._id === initialChatId
          ? { ...item, chat: item.chat ? { ...item.chat, unreadCount: 0 } : null }
          : item
      )
    );
  }, [initialChatId, selectedChat?._id, setSelectedChat, setSelectedUser, userList]);

  // ── Re-fetch on new socket message (updates last message preview + unread)
  useEffect(() => {
    if (!socket) return;
    const handler = () => fetchChats();
    socket.on("message received", handler);
    return () => socket.off("message received", handler);
  }, [socket, fetchChats]);

  // ── Filter by search (client-side, no extra API needed)
  const filtered = userList.filter((item) =>
    item.user.fullName.toLowerCase().includes(search.toLowerCase())
  );

  // ── Open or create a chat when a user is clicked
  const handleUserClick = async (item: UserWithChat) => {
    if (item.chat) {
      // Chat already exists — just open it
      setSelectedChat(item.chat);
      setSelectedUser(item.user);

      // Optimistically clear unread for this chat
      setUserList((prev) =>
        prev.map((i) =>
          i.user._id === item.user._id
            ? { ...i, chat: i.chat ? { ...i.chat, unreadCount: 0 } : null }
            : i
        )
      );
    } else {
      // No chat yet — create one via POST /api/chat
      try {
        const res = await axios.post(
          "http://localhost:5000/api/chat",
          { userId: item.user._id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const newChat = res.data;
        setSelectedChat(newChat);
        setSelectedUser(item.user);
        // Refresh the list so the new chat appears
        fetchChats();
      } catch (err) {
        console.error("accessChat error:", err);
      }
    }
  };

  // ── Format timestamp to time or date label
  const formatTime = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    if (isToday) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    return date.toLocaleDateString([], {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });
  };

  return (
    <div className="w-[340px] min-w-[280px] flex flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      {/* ── Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-bold text-gray-800 dark:text-white">Chats</h2>
      </div>

      {/* ── Search bar */}
      <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-full">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-gray-400"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..."
            className="flex-1 bg-transparent text-sm outline-none text-gray-700 dark:text-gray-200"
          />
          {search && (
            <button onClick={() => setSearch("")} className="text-gray-400 text-xs">
              ✕
            </button>
          )}
        </div>
      </div>

      {/* ── User + Chat list */}
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2 py-10">
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <p className="text-sm">No users found.</p>
          </div>
        ) : (
          filtered.map((item) => {
            const { user, chat } = item;
            const isOnline = onlineUsers.includes(user._id);
            const isSelected = selectedChat?._id === chat?._id && !!chat;
            const hasUnread = (chat?.unreadCount ?? 0) > 0;

            return (
              <button
                key={user._id}
                onClick={() => handleUserClick(item)}
                className={`w-full flex items-center gap-3 px-4 py-3 transition-colors text-left border-b border-gray-50 dark:border-gray-700/50 ${
                  isSelected
                    ? "bg-blue-50 dark:bg-blue-900/20"
                    : "hover:bg-gray-50 dark:hover:bg-gray-700/50"
                }`}
              >
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                    {user.image ? (
                      <Image
                        src={`http://localhost:5000/${user.image}`}
                        alt={user.fullName}
                        width={48}
                        height={48}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <span className="text-lg font-bold text-white">
                        {user.fullName.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  {/* Online dot */}
                  {isOnline && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full" />
                  )}
                </div>

                {/* Name & last message */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-sm font-semibold truncate ${
                        isSelected
                          ? "text-blue-700 dark:text-blue-300"
                          : "text-gray-800 dark:text-white"
                      }`}
                    >
                      {user.fullName}
                    </span>
                    {chat?.latestMessage && (
                      <span className="text-xs text-gray-400 flex-shrink-0 ml-1">
                        {formatTime(chat.latestMessage.createdAt)}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-0.5">
                    <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {chat?.latestMessage
                        ? `${
                            chat.latestMessage.sender?.fullName === user.fullName
                              ? ""
                              : "You: "
                          }${chat.latestMessage.content}`
                        : "No messages yet"}
                    </span>

                    {/* Unread badge */}
                    {hasUnread && (
                      <span className="ml-2 flex-shrink-0 min-w-[20px] h-5 px-1 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center font-medium">
                        {chat!.unreadCount! > 99 ? "99+" : chat!.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
