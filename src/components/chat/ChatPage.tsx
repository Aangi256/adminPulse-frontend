"use client";

import { useState, useEffect } from "react";
import io, { Socket } from "socket.io-client";
import UserList from "./UserList";
import ChatBox from "./ChatBox";

const ENDPOINT = "http://localhost:5000";

export default function ChatPage() {
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [totalUnread, setTotalUnread] = useState(0);
  // ── Use useState (not useRef) so child components re-render when socket is ready
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    const newSocket = io(ENDPOINT, { transports: ["websocket"] });

    newSocket.on("connect", () => {
      newSocket.emit("setup", userId);
    });

    // ── Receive live online user list from server
    newSocket.on("online users", (users: string[]) => {
      setOnlineUsers(users);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <div className="flex h-[calc(100vh-70px)] bg-gray-100 dark:bg-gray-900 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
      {/* Left Panel – User / Chat List */}
      <UserList
        socket={socket}
        onlineUsers={onlineUsers}
        selectedChat={selectedChat}
        setSelectedChat={setSelectedChat}
        setSelectedUser={setSelectedUser}
        totalUnread={totalUnread}
        setTotalUnread={setTotalUnread}
      />

      {/* Right Panel – Chat Box */}
      <ChatBox
        socket={socket}
        selectedChat={selectedChat}
        selectedUser={selectedUser}
        onlineUsers={onlineUsers}
        setTotalUnread={setTotalUnread}
      />
    </div>
  );
}
