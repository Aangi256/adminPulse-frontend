"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import io, { Socket } from "socket.io-client";
import UserList from "./UserList";
import ChatBox from "./ChatBox";

const ENDPOINT = "http://localhost:5000";

export default function ChatPage() {
  const searchParams = useSearchParams();
  const initialChatId = searchParams.get("chatId");
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [totalUnread, setTotalUnread] = useState(0);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return;

    const parsedUser = JSON.parse(storedUser);
    const userId = parsedUser.id;

    if (!userId) return;

    const newSocket = io(ENDPOINT, { transports: ["websocket"] });

    newSocket.on("connect", () => {
      console.log("✅ Socket Connected");
      newSocket.emit("setup", userId);
    });

    newSocket.on("online users", (users: string[]) => {
      setOnlineUsers(users);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100 dark:bg-gray-900">
      
      <UserList
        socket={socket}
        onlineUsers={onlineUsers}
        initialChatId={initialChatId}
        selectedChat={selectedChat}
        setSelectedChat={setSelectedChat}
        setSelectedUser={setSelectedUser}
        totalUnread={totalUnread}
        setTotalUnread={setTotalUnread}
      />

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
