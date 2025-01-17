import React, { useState } from "react";
import { BsChatLeftFill } from "react-icons/bs";
import { FaSearch } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { MdLogout } from "react-icons/md";
import { useRouter } from "next/navigation";
import { RiNotificationFill } from "react-icons/ri";
import { useSelector } from "react-redux";
import { LiaUserFriendsSolid } from "react-icons/lia";
import { ClipLoader } from "react-spinners"; 

const Sidebar = ({ setSelectedComponent, setSelectedProfileId }) => {
  const router = useRouter();
  const user = useSelector((state) => state.user.user);
  const [showNotifications, setShowNotifications] = useState(false);
  const [friendRequests, setFriendRequests] = useState([]);
  const [showFriends, setShowFriends] = useState(false);
  const [friends, setFriends] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [loadingFriends, setLoadingFriends] = useState(false);

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      } else {
        console.error("Failed to log out");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const fetchFriendRequests = async () => {
    setLoadingRequests(true);
    try {
      const response = await fetch(`/api/all-friend-requests/${user._id}`);
      if (response.ok) {
        const data = await response.json();
        setFriendRequests(data.friendRequests);
      } else {
        console.error("Failed to fetch friend requests");
      }
    } catch (error) {
      console.error("Error fetching friend requests:", error);
    } finally {
      setLoadingRequests(false);
    }
  };

  const fetchFriends = async () => {
    setLoadingFriends(true);
    try {
      const response = await fetch(`/api/all-friends/${user._id}`);
      if (response.ok) {
        const data = await response.json();
        setFriends(data.friends);
      } else {
        console.error("Failed to fetch friends");
      }
    } catch (error) {
      console.error("Error fetching friends:", error);
    } finally {
      setLoadingFriends(false);
    }
  };

  const handleSelectedComponent = () => {
    setSelectedComponent("profile");
    setSelectedProfileId(user._id);
  };

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) {
      fetchFriendRequests();
    }
  };

  const handleFriendsClick = () => {
    setShowFriends(!showFriends);
    if (!showFriends) {
      fetchFriends();
    }
  };

  const handleAcceptRequest = async (friendId) => {
    try {
      const response = await fetch("/api/accept-friend-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user._id,
          friendId,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setFriendRequests((prevRequests) =>
          prevRequests.filter((request) => request._id !== friendId)
        );
        console.log(result.message);
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error("Error accepting friend request:", error);
    }
  };

  const handleRejectRequest = async (friendId) => {
    try {
      const response = await fetch("/api/reject-friend-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user._id,
          friendId,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setFriendRequests((prevRequests) =>
          prevRequests.filter((request) => request._id !== friendId)
        );
        console.log(result.message);
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error("Error rejecting friend request:", error);
    }
  };

  const handleRemoveFriend = async (friendId) => {
    try {
      const response = await fetch("/api/remove-friend", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user._id,
          friendId: friendId,
        }),
      });

      if (response.ok) {
        setFriends((prevFriends) =>
          prevFriends.filter((friend) => friend._id !== friendId)
        );
        console.log("Friend removed successfully");
      } else {
        console.error("Failed to remove friend");
      }
    } catch (error) {
      console.error("Error removing friend:", error);
    }
  };

  return (
    <div className="w-[90px] items-center justify-between flex flex-col text-[21px] h-full text-white py-4">
      <div>
        <p className="text-4xl">T</p>
      </div>

      <div className="flex flex-col justify-center mb-2 h-full items-center gap-16">
        <FaSearch
          className="cursor-pointer hover:text-yellow-400 hover:scale-110 transition-transform duration-200"
          onClick={() => setSelectedComponent("search")}
        />
        <CgProfile
          className="cursor-pointer hover:text-yellow-400 hover:scale-110 transition-transform duration-200"
          onClick={handleSelectedComponent}
        />
        <div className="relative">
          <RiNotificationFill
            className="cursor-pointer hover:text-yellow-400 hover:scale-110 transition-transform duration-200"
            onClick={handleNotificationClick}
          />
          {user?.friendRequests?.length > 0 && (
            <span className="absolute bottom-3 left-3 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
              {user.friendRequests.length}
            </span>
          )}
        </div>
        <LiaUserFriendsSolid
          className="cursor-pointer hover:text-yellow-400 hover:scale-110 transition-transform duration-200"
          onClick={handleFriendsClick}
        />
      </div>

      <div
        className="mb-4 cursor-pointer hover:text-yellow-400 hover:scale-110 transition-transform duration-200"
        onClick={handleLogout}
      >
        <MdLogout />
      </div>

      {showNotifications && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setShowNotifications(false)}
          ></div>

          <div className="fixed inset-0 mb-24 flex items-center justify-center z-50">
            <div
              className="bg-white rounded-xl shadow-lg p-6 w-[30rem] max-w-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-black">
                  Friend Requests
                </h2>
                <button
                  className="text-black text-3xl hover:scale-105 duration-75 hover:text-red-600 font-bold cursor-pointer"
                  onClick={() => setShowNotifications(false)}
                >
                  &times;
                </button>
              </div>
              {loadingRequests ? (
                <div className="flex justify-center">
                  <ClipLoader color="#000" size={50} />
                </div>
              ) : friendRequests.length > 0 ? (
                friendRequests.map((request) => (
                  <div
                    key={request._id}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-100 transition duration-150 ease-in-out"
                  >
                    <img
                      src={
                        request.profilePhoto
                          ? request.profilePhoto
                          : "/profilephoto.jpg"
                      }
                      alt={`${request.name}'s profile`}
                      className="w-14 h-14 rounded-full object-cover mr-4"
                    />
                    <div className="flex flex-col">
                      <p className="text-lg font-semibold text-gray-800">
                        {request.name} {request.surname}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="bg-blue-500 text-white text-xs px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-150 ease-in-out"
                        onClick={() => handleAcceptRequest(request._id)}
                      >
                        Accept
                      </button>
                      <button
                        className="bg-red-500 text-white text-xs px-4 py-2 rounded-lg hover:bg-red-600 transition duration-150 ease-in-out"
                        onClick={() => handleRejectRequest(request._id)}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex justify-center items-center h-full text-gray-500">
                  <p className="text-sm">No friend requests at the moment.</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {showFriends && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setShowFriends(false)}
          ></div>

          <div className="fixed inset-0 mb-24 flex items-center justify-center z-50">
            <div
              className="bg-white rounded-xl shadow-lg p-6 max-h-[20rem] overflow-y-auto scrollbar-hide  w-[30rem] max-w-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-black">Friends</h2>
                <button
                  className="text-black text-3xl hover:scale-105 duration-75 hover:text-red-600 font-bold cursor-pointer"
                  onClick={() => setShowFriends(false)}
                >
                  &times;
                </button>
              </div>
              {loadingFriends ? (
                <div className="flex justify-center">
                  <ClipLoader color="#000" size={50} />
                </div>
              ) : friends.length > 0 ? (
                friends.map((friend) => (
                  <div
                    key={friend._id}
                    className="flex items-center flex-col gap-1 justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-100 transition duration-150 ease-in-out"
                  >
                    <img
                      src={
                        friend.profilePhoto
                          ? friend.profilePhoto
                          : "/profilephoto.jpg"
                      }
                      alt={`${friend.name}'s profile`}
                      className="w-14 h-14 rounded-full object-cover mr-4"
                    />
                    <div className="flex flex-col">
                      <p className="text-lg font-semibold text-gray-800">
                        {friend.name} {friend.surname}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="bg-red-500 text-white text-xs px-4 py-2 rounded-lg hover:bg-red-600 transition duration-150 ease-in-out"
                        onClick={() => handleRemoveFriend(friend._id)}
                      >
                        Remove Friend
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex justify-center items-center h-full text-gray-500">
                  <p className="text-sm">No friends at the moment.</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Sidebar;
