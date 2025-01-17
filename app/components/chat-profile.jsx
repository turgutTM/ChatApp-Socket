"use client";
import React, { useState, useEffect } from "react";
import { IoSearch } from "react-icons/io5";
import { LiaCheckDoubleSolid } from "react-icons/lia";
import { useSelector } from "react-redux";
import Skeleton from "./Skeleton";

const Chatprofile = ({ setSelectedProfileId, setSelectedProfileData }) => {
  const [friends, setFriends] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [lastMessageData, setLastMessageData] = useState({});
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    const fetchFriendsAndLastMessages = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/all-friends/${user._id}`);
        if (response.ok) {
          const data = await response.json();
          setFriends(data.friends || []);
          const lastMessagePromises = data.friends.map(async (friend) => {
            const lastMessageResponse = await fetch(
              `/api/last-message-time?senderId=${user._id}&receiverId=${friend._id}`
            );
            if (lastMessageResponse.ok) {
              const { lastMessageTime, lastMessageContent, unreadCount } =
                await lastMessageResponse.json();
              return {
                friendId: friend._id,
                lastMessageTime,
                lastMessage: lastMessageContent,
                unreadCount,
              };
            }
            return {
              friendId: friend._id,
              lastMessageTime: "No messages",
              lastMessage: "No recent messages",
              unreadCount: 0,
            };
          });
          const lastMessageResults = await Promise.all(lastMessagePromises);
          const lastMessageMap = {};
          lastMessageResults.forEach(
            ({ friendId, lastMessageTime, lastMessage, unreadCount }) => {
              lastMessageMap[friendId] = {
                lastMessageTime,
                lastMessage,
                unreadCount,
              };
            }
          );
          setLastMessageData(lastMessageMap);
        }
      } catch (error) {
        console.error("Error fetching friends:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFriendsAndLastMessages();
  }, [user._id]);

  const formatTime = (isoTime) => {
    if (!isoTime) return "";
    const date = new Date(isoTime);
    if (isNaN(date.getTime())) return "";
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const handleProfileClick = async (profileId) => {
    setSelectedProfileId(profileId);
    try {
      const response = await fetch(`/api/user/${profileId}`);
      if (response.ok) {
        const profileData = await response.json();
        setSelectedProfileData(profileData);
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  const filteredFriends = friends.filter((friend) =>
    `${friend.name} ${friend.surname}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-full gap-4 flex flex-col p-3">
      <div className="flex border bg-slate-200 items-center p-2 gap-2 rounded-[10px]">
        <IoSearch className="text-gray-500 text-2xl" />
        <input
          className="bg-slate-200 focus:outline-none placeholder:text-gray-500 w-full"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {loading ? (
        [...Array(7)].map((_, index) => (
          <Skeleton key={index} type="chatprofile" />
        ))
      ) : (
        <div className="gap-8 flex flex-col overflow-y-auto scrollbar-hide">
          {filteredFriends.length > 0 ? (
            filteredFriends.map((friend) => (
              <div
                key={friend._id}
                className="flex gap-3 items-center cursor-pointer"
                onClick={() => handleProfileClick(friend._id)}
              >
                <div className="w-12 h-12">
                  <img
                    className="w-full h-full object-cover rounded-lg"
                    src={friend.profilePhoto || "/profilephoto.jpg"}
                    alt={`${friend.name}'s profile`}
                  />
                </div>
                <div className="flex flex-col w-[14rem] overflow-auto break-words">
                  <div className="flex items-center justify-between gap-4">
                    <p className="font-medium">{`${friend.name} ${friend.surname}`}</p>
                    {friend.lastMessageStatus === "read" && (
                      <LiaCheckDoubleSolid className="text-2xl text-blue-600" />
                    )}
                    <p className="text-gray-400 text-sm">
                      {lastMessageData[friend._id]
                        ? formatTime(
                            lastMessageData[friend._id].lastMessageTime
                          )
                        : "No messages"}
                    </p>
                  </div>
                  <div className=" flex justify-between w-full ">
                    <p className="text-gray-400 w-full whitespace-nowrap overflow-hidden text-ellipsis">
                      {lastMessageData[friend._id]?.lastMessage ||
                        "No recent messages"}
                    </p>
                    {lastMessageData[friend._id]?.unreadCount > 0 && (
                      <span className="text-xs font-semibold border rounded-full text-white bg-green-500 p-2 w-4 h-4 justify-center flex items-center  ">
                        {lastMessageData[friend._id].unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No friends found</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Chatprofile;
