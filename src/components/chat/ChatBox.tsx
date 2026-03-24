"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import io from "socket.io-client";

const ENDPOINT = "http://localhost:5000";
let socket: any;

export default function ChatBox({ selectedChat, selectedUser }: any) {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    socket = io(ENDPOINT);

    socket.on("connect", () => {
      console.log("Socket connected");
    });

    socket.on("message received", (msg: any) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    console.log("Selected User:", selectedUser);
  }, [selectedUser]);

  useEffect(() => {
    if (!selectedChat || !socket) return;

    console.log("Selected Chat:", selectedChat);

    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/message/${selectedChat._id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setMessages(res.data);

        socket.emit("join chat", selectedChat._id);
      } catch (err) {
        console.log("Fetch message error:", err);
      }
    };

    fetchMessages();
  }, [selectedChat]);

  const sendMessage = async () => {
    if (!newMessage) return;  

    try {
      const res = await axios.post(
        "http://localhost:5000/api/message",
        {
          content: newMessage,
          chatId: selectedChat._id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      socket.emit("new message", res.data);

      setMessages((prev) => [...prev, res.data]);
      setNewMessage("");
    } catch (err) {
      console.log("Send message error:", err);
    }
  };

  if (!selectedChat) {
    return (
      <div className="w-2/3 flex items-center justify-center">
        {selectedUser?.fullName || "Select a user"}
      </div>
    );
  }

  return (
    <div className="w-2/3 flex flex-col p-3">
      <div className="font-semibold text-lg border-b pb-2 mb-2">
        {selectedUser?.fullName || "User"}
      </div>

      <div className="flex-1 overflow-y-auto">
        {messages.map((msg, i) => (
          <div key={i}>
            <b>{msg.sender?.name}:</b> {msg.content}
          </div>
        ))}
      </div>

      <div className="flex mt-2">
        <input
          className="flex-1 border p-2"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />

        <button
          onClick={sendMessage}
          className="ml-2 px-4 bg-blue-500 text-white"
        >
          Send
        </button>
      </div>
    </div>
  );
}