"use client";
import React, { useState, useEffect, useRef } from "react";
import { IoCallOutline, IoSend } from "react-icons/io5";
import { LuVideo } from "react-icons/lu";
import { PiDotsThreeOutlineFill } from "react-icons/pi";
import { useSelector } from "react-redux";
import { BiCheckDouble } from "react-icons/bi";
import Skeleton from "./Skeleton";
import socket from "../utils/socket";
import { MdOutlineDeleteOutline } from "react-icons/md";

const Chatconv = ({ selectedProfileId, selectedProfileData, setLastMessageTime }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const messagesEndRef = useRef(null);

  const user = useSelector((state) => state.user.user);

  const [typingUsers, setTypingUsers] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);


  useEffect(() => {
    if (user && socket) {
      socket.emit("join_room", user._id);
    }
  }, [user]);

  useEffect(() => {
    if (!socket) return;
    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });
    socket.on("connect_error", (error) => {
      console.error("Socket error:", error);
    });
    socket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
    });
    return () => {
      socket.off("connect");
      socket.off("connect_error");
      socket.off("disconnect");
    };
  }, []);

 
  const handleTyping = () => {
    if (!isTyping) {
      socket.emit("typing", { senderId: user._id, receiverId: selectedProfileId });
      setIsTyping(true);
    }
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stop_typing", { senderId: user._id, receiverId: selectedProfileId });
      setIsTyping(false);
    }, 2000);
  };

  useEffect(() => {
    if (!socket) return;
    const handleUserTyping = ({ senderId }) => {
      setTypingUsers((prev) => [...new Set([...prev, senderId])]);
    };
    const handleUserStopTyping = ({ senderId }) => {
      setTypingUsers((prev) => prev.filter((id) => id !== senderId));
    };
    socket.on("user_typing", handleUserTyping);
    socket.on("user_stop_typing", handleUserStopTyping);
    return () => {
      socket.off("user_typing", handleUserTyping);
      socket.off("user_stop_typing", handleUserStopTyping);
    };
  }, [socket]);

  // Clear old messages and load fresh messages whenever selectedProfileId changes
  useEffect(() => {
    setMessages([]);
    if (selectedProfileId && selectedProfileId !== user._id) {
      fetchConversationMessages();
    } else {
      setLoading(false);
    }
  }, [selectedProfileId]);

  const fetchConversationMessages = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/get-message?senderId=${user._id}&receiverId=${selectedProfileId}`
      );
      if (response.ok) {
        const data = await response.json();
        const filteredMessages = data.filter(
          (msg) => !(msg.deletedBy && msg.deletedBy.includes(user._id))
        );
        setMessages(filteredMessages);
        if (filteredMessages.length > 0) {
          const lastMessage = filteredMessages[filteredMessages.length - 1];
          const formattedTimestamp = new Date(lastMessage.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });
          setLastMessageTime(formattedTimestamp);
        }
      } else {
        console.error("Failed to fetch messages");
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

 
  useEffect(() => {
    if (!socket) return;
    const receiveMessage = (incomingMessage) => {
      if (
        (incomingMessage.sender === selectedProfileId && incomingMessage.receiver === user._id) ||
        (incomingMessage.sender === user._id && incomingMessage.receiver === selectedProfileId)
      ) {
        setMessages((prev) => [...prev, incomingMessage]);
      }
    };
    socket.on("receive_message", receiveMessage);
    return () => {
      socket.off("receive_message", receiveMessage);
    };
  }, [socket, selectedProfileId, user._id]);


  useEffect(() => {
    if (!socket) return;
    const handleUpdateMessageStatus = ({ messageId, read }) => {
      setMessages((prevMessages) =>
        prevMessages.map((m) => {
          if (m._id === messageId) {
            return { ...m, read: true };
          }
          return m;
        })
      );
    };
    socket.on("update_message_status", handleUpdateMessageStatus);
    return () => {
      socket.off("update_message_status", handleUpdateMessageStatus);
    };
  }, [socket, selectedProfileId, user._id]);


  useEffect(() => {
    messages.forEach((msg) => {
      const belongsToCurrentChat =
        (msg.sender === selectedProfileId && msg.receiver === user._id) ||
        (msg.sender === user._id && msg.receiver === selectedProfileId);

      if (!msg.read && msg.receiver === user._id && belongsToCurrentChat) {
        markMessageAsRead(msg._id, msg.sender);
      }
    });
  }, [messages, user._id, selectedProfileId]);

  const markMessageAsRead = async (messageId, originalSenderId) => {
    try {
      const response = await fetch("/api/mark-message-read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messageId }),
      });
      if (!response.ok) {
        throw new Error("Failed to mark message as read");
      }
      setMessages((prevMessages) =>
        prevMessages.map((m) => (m._id === messageId ? { ...m, read: true } : m))
      );
      socket.emit("mark_message_as_read", { messageId, originalSenderId });
    } catch (error) {
      console.error("Error marking message as read:", error);
    }
  };

 
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (message.trim() === "") return;
    const senderId = user._id;
    const receiverId = selectedProfileId;
    const content = message;
    const now = new Date();
    const formattedTimestamp = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    try {
      const response = await fetch("/api/send-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senderId, receiverId, content }),
      });
      if (response.ok) {
        const savedMessage = await response.json();
        setMessages((prev) => [...prev, savedMessage]);
        setLastMessageTime(formattedTimestamp);
        socket.emit("send_message", savedMessage);
        setMessage("");
      } else {
        console.error("Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleDeleteMessages = async () => {
    try {
      const messageIds = messages.map((msg) => msg._id);
      const response = await fetch("/api/delete-messages", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messageIds, userId: user._id }),
      });
      if (response.ok) {
        setMessages((prev) => prev.filter((msg) => !messageIds.includes(msg._id)));
      } else {
        console.error("Failed to delete messages");
      }
    } catch (error) {
      console.error("Error deleting messages:", error);
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  return (
    <div className="flex flex-col justify-between h-full">
      {selectedProfileId === user._id ? (
        <div className="flex flex-col items-center justify-center h-full">
          <img src="/computermessaging.jpg" alt="Computer Messaging" className="w-1/2 h-auto" />
          <p className="text-gray-500 mt-4">Choose someone and start conversation</p>
        </div>
      ) : (
        <>
          <div>
            <div className="flex items-center p-2 border-b-[1px] w-full gap-3 relative">
              <div className="w-16 h-12">
                <img
                  className="w-full h-full object-cover rounded-full"
                  src={selectedProfileData?.profilePhoto || "/profilephoto.jpg"}
                  alt="Profile"
                />
              </div>
              <div>
                <p className="font-semibold w-32">
                  {selectedProfileData?.name} {selectedProfileData?.surname}
                </p>
              </div>
              <div className="w-full items-center gap-5 text-2xl mr-3 flex justify-end">
                <IoCallOutline />
                <LuVideo />
                <PiDotsThreeOutlineFill
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="cursor-pointer"
                />
              </div>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-[5rem] mr-3 w-48 bg-white border border-gray-300 rounded-lg shadow-lg">
                  <ul className="py-2">
                    <li
                      onClick={handleDeleteMessages}
                      className="px-4 h-full flex items-center gap-1 hover:text-red-500 duration-100 cursor-pointer"
                    >
                      <MdOutlineDeleteOutline />
                      <p className="w-full text-sm">Delete all messages</p>
                    </li>
                  </ul>
                </div>
              )}
            </div>
            {loading ? (
              <Skeleton type="chatconv" />
            ) : (
              <div className="p-4 flex flex-col gap-3 h-[76vh] overflow-y-auto scrollbar-hide">
                {messages.length > 0 ? (
                  messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        msg.sender === user._id ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[38rem] p-3 rounded-2xl text-white ${
                          msg.sender === user._id ? "bg-[#4b4b4b]" : "bg-green-900"
                        } overflow-auto break-words`}
                      >
                        <p>{msg.content}</p>
                        <div className="flex justify-end items-center gap-1">
                          <p className="text-xs text-gray-300 text-right mt-1">
                            {formatTimestamp(msg.timestamp)}
                          </p>
                          {msg.sender === user._id &&
                            (msg.read ? (
                              <BiCheckDouble className="text-xl mt-[5px] text-blue-500" />
                            ) : (
                              <BiCheckDouble className="text-xl mt-[5px] text-gray-500" />
                            ))}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center">No messages yet. Start the conversation!</p>
                )}
                {typingUsers.includes(selectedProfileId) && (
                  <p className="text-sm text-gray-500">Typing...</p>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
          <div className="flex items-center p-4 gap-2">
            <input
              type="text"
              className="w-full p-2 border-[#c1bfbf] border rounded-full focus:outline-none"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                handleTyping();
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSendMessage();
              }}
            />
            <button className="text-2xl text-blue-500 p-2" onClick={handleSendMessage}>
              <IoSend />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Chatconv;
