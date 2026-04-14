"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import Image from "next/image";

interface Message {
  _id: string;
  content: string;
  sender: {
    _id: string;
    fullName: string;
    image?: string;
  };
  chat: any;
  readBy: string[];
  createdAt: string;
}

interface Props {
  socket: any;
  selectedChat: any;
  selectedUser: any;
  onlineUsers: string[];
  setTotalUnread: (fn: (n: number) => number) => void;
}

// ── Helper: format date separators
function getDateLabel(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const msgDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diff = Math.floor((today.getTime() - msgDay.getTime()) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  return date.toLocaleDateString([], { day: "numeric", month: "long", year: "numeric" });
}

// ── Helper: format time
function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ChatBox({
  socket,
  selectedChat,
  selectedUser,
  onlineUsers,
  setTotalUnread,
}: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const myId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // ── Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // ── Fetch messages when chat changes
  const fetchMessages = useCallback(async () => {
    if (!selectedChat || !token) return;
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:5000/api/message/${selectedChat._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages(res.data.filter((m: Message) => m?.sender?._id));

      // Join the socket room for this chat
      socket?.emit("join chat", selectedChat._id);

      // Decrease total unread since we just read this chat
      setTotalUnread((prev: number) => Math.max(0, prev - (selectedChat.unreadCount || 0)));
    } catch (err) {
      console.error("fetchMessages error:", err);
    } finally {
      setLoading(false);
    }
  }, [selectedChat, token, socket]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // ── Listen for incoming messages
  useEffect(() => {
    if (!socket) return;

    const handleMessageReceived = (msg: Message) => {
      // Only add the message if it belongs to the open chat
      if (selectedChat && msg.chat?._id === selectedChat._id) {
        setMessages((prev) => [...prev, msg]);
        // Mark as read immediately
        axios
          .put(
            `http://localhost:5000/api/message/read/${selectedChat._id}`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
          )
          .catch(() => {});
      }
      // If message is for a different chat, the UserList will handle the unread badge
    };

    socket.on("message received", handleMessageReceived);
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));

    return () => {
      socket.off("message received", handleMessageReceived);
      socket.off("typing");
      socket.off("stop typing");
    };
  }, [socket, selectedChat, token]);

  // ── Send message
  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;

    socket?.emit("stop typing", selectedChat._id);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/message",
        { content: newMessage, chatId: selectedChat._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const sent: Message = res.data;
      setMessages((prev) => [...prev, sent]);
      setNewMessage("");

      // Emit via socket so other user gets it in real time
      socket?.emit("new message", sent);
    } catch (err) {
      console.error("sendMessage error:", err);
    }
  };

  // ── Send on Enter key
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendMessage();
  };

  // ── Typing indicator
  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);

    if (!socket || !selectedChat) return;

    socket.emit("typing", selectedChat._id);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stop typing", selectedChat._id);
    }, 2000);
  };

  // ── Group messages by date for date separators
  const groupedMessages = () => {
    const groups: { date: string; messages: Message[] }[] = [];
    messages.forEach((msg) => {
      const label = getDateLabel(msg.createdAt);
      const last = groups[groups.length - 1];
      if (last && last.date === label) {
        last.messages.push(msg);
      } else {
        groups.push({ date: label, messages: [msg] });
      }
    });
    return groups;
  };

  // ── Seen tick component
  const SeenTick = ({ msg }: { msg: Message }) => {
    const isMine = msg.sender?._id?.toString() === myId?.toString();
    if (!isMine) return null;
    const seen = msg.readBy?.some((id) => id !== myId);
    return (
      <span className={`text-xs ml-1 ${seen ? "text-blue-400" : "text-gray-400"}`}>
        {seen ? "✓✓" : "✓"}
      </span>
    );
  };

  // ── Empty state
  if (!selectedChat) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 gap-4">
        <div className="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.5">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
            Select a conversation
          </p>
          <p className="text-sm text-gray-400 mt-1">
            Choose from your existing chats or start a new one
          </p>
        </div>
      </div>
    );
  }

  const isOnline = selectedUser && onlineUsers.includes(selectedUser._id);

  return (
    <div className="flex-1 flex flex-col bg-[#f0f4f8] dark:bg-gray-900 min-w-0">

      {/* ── Chat Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
            {selectedUser?.image ? (
              <Image
                src={`http://localhost:5000/${selectedUser.image}`}
                alt={selectedUser.fullName}
                width={40}
                height={40}
                className="object-cover w-full h-full"
              />
            ) : (
              <span className="text-base font-bold text-white">
                {selectedUser?.fullName?.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          {isOnline && (
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full" />
          )}
        </div>

        {/* Name & status */}
        <div className="flex-1">
          <p className="font-semibold text-gray-800 dark:text-white text-sm">
            {selectedUser?.fullName || "User"}
          </p>
          <p className={`text-xs ${isTyping ? "text-blue-500" : isOnline ? "text-green-500" : "text-gray-400"}`}>
            {isTyping ? "typing..." : isOnline ? "Online" : "Offline"}
          </p>
        </div>
      </div>

      {/* ── Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex justify-center items-center h-full text-gray-400 text-sm">
            No messages yet. Say hello! 👋
          </div>
        ) : (
          groupedMessages().map((group) => (
            <div key={group.date}>
              {/* ── Date Separator */}
              <div className="flex items-center justify-center my-4">
                <span className="px-3 py-1 bg-white dark:bg-gray-700 text-xs text-gray-500 dark:text-gray-400 rounded-full shadow-sm border border-gray-200 dark:border-gray-600">
                  {group.date}
                </span>
              </div>

              {/* ── Messages in this date group */}
              {group.messages.filter((msg) => msg?.sender?._id).map((msg, index) => {
                const isMine = msg.sender._id?.toString() === myId?.toString();
                const prevMsg = group.messages[index - 1];
                const showAvatar =
                  !isMine &&
                  (!prevMsg || !prevMsg.sender?._id || prevMsg.sender._id?.toString() !== msg.sender._id?.toString());

                return (
                  <div
                    key={msg._id}
                    className={`flex items-end gap-2 mb-1 ${isMine ? "flex-row-reverse" : "flex-row"}`}
                  >
                    {/* ── Other user avatar (only show when sender changes) */}
                    {!isMine && (
                      <div className="w-7 h-7 flex-shrink-0">
                        {showAvatar ? (
                          <div className="w-7 h-7 rounded-full overflow-hidden bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                            {msg.sender.image ? (
                              <Image
                                src={`http://localhost:5000/${msg.sender.image}`}
                                alt={msg.sender.fullName}
                                width={28}
                                height={28}
                                className="object-cover"
                              />
                            ) : (
                              <span className="text-xs font-bold text-white">
                                {msg.sender.fullName?.charAt(0).toUpperCase()}
                              </span>
                            )}
                          </div>
                        ) : null}
                      </div>
                    )}

                    {/* ── Bubble */}
                    <div className={`max-w-[65%] ${isMine ? "items-end" : "items-start"} flex flex-col`}>
                      {/* Sender name (only when avatar shows) */}
                      {!isMine && showAvatar && (
                        <span className="text-xs text-gray-500 dark:text-gray-400 mb-0.5 ml-1">
                          {msg.sender.fullName}
                        </span>
                      )}

                      <div
                        className={`px-3 py-2 rounded-2xl text-sm shadow-sm ${
                          isMine
                            ? "bg-blue-500 text-white rounded-br-sm"
                            : "bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-bl-sm"
                        }`}
                      >
                        <p className="leading-relaxed break-words">{msg.content}</p>

                        {/* Time & seen tick */}
                        <div className={`flex items-center gap-0.5 mt-1 ${isMine ? "justify-end" : "justify-start"}`}>
                          <span className={`text-[10px] ${isMine ? "text-blue-200" : "text-gray-400"}`}>
                            {formatTime(msg.createdAt)}
                          </span>
                          <SeenTick msg={msg} />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        )}

        {/* ── Typing indicator */}
        {isTyping && (
          <div className="flex items-end gap-2 mb-1">
            <div className="w-7 h-7 flex-shrink-0" />
            <div className="px-4 py-3 bg-white dark:bg-gray-700 rounded-2xl rounded-bl-sm shadow-sm">
              <div className="flex gap-1 items-center h-4">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* ── Input Bar */}
      <div className="px-4 py-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 bg-gray-100 dark:bg-gray-700 rounded-full px-4 py-2">
          {/* Message input */}
          <input
            type="text"
            value={newMessage}
            onChange={handleTyping}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="flex-1 bg-transparent text-sm text-gray-700 dark:text-gray-200 outline-none placeholder-gray-400"
          />

          {/* Send button */}
          <button
            onClick={sendMessage}
            disabled={!newMessage.trim()}
            className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full transition-colors ${
              newMessage.trim()
                ? "bg-blue-500 hover:bg-blue-600 text-white"
                : "bg-gray-300 dark:bg-gray-600 text-gray-400 cursor-not-allowed"
            }`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
