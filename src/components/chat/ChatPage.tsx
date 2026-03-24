"use client";

import { useState } from "react";
import UserList from "./UserList";
import ChatBox from "./ChatBox";

export default function ChatPage() {
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  return (
    <div className="flex h-[90vh] border rounded">
      <UserList 
        setSelectedChat={setSelectedChat} 
        setSelectedUser={setSelectedUser} 
      />
      <ChatBox 
        selectedChat={selectedChat} 
        selectedUser={selectedUser} 
      />
    </div>
  );
}