import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FaSearch, FaGithub, FaInstagram, FaUserFriends } from "react-icons/fa";
import { CiLinkedin } from "react-icons/ci";
import { IoMdPersonAdd } from "react-icons/io";
import { MdReport } from "react-icons/md";
import { BiDotsHorizontalRounded } from "react-icons/bi";

const Search = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [sentRequests, setSentRequests] = useState(new Set());

  const currentUser = useSelector((state) => state.user.user);
  const currentUserId = currentUser?._id;
  const friendsList = currentUser?.friends || [];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/all-users", {
          cache: "no-store",
        });
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() !== "") {
      const normalizedSearchTerm = searchTerm.toLowerCase().trim();
      const searchWords = normalizedSearchTerm.split(/\s+/);

      const results = users
        .filter((user) => user._id !== currentUserId)
        .filter((user) => {
          const normalizedName = `${user.name.toLowerCase()} ${user.surname.toLowerCase()}`;
          return searchWords.every((word) => normalizedName.includes(word));
        });

      setFilteredUsers(results);
    } else {
      setFilteredUsers([]);
    }
  }, [searchTerm, users, currentUserId]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleAddFriend = async (friendId) => {
    setSentRequests(new Set([...sentRequests, friendId]));
    try {
      await fetch("/api/send-friend-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: currentUserId, friendId }),
      });
    } catch (error) {
      console.error("Error sending friend request:", error);
    }
  };

  return (
    <div className="h-full flex flex-col items-center w-full rounded-3xl starry-bg shadow-lg">
      <div className="relative w-3/4 mt-4 max-w-lg mb-8">
        <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl" />
        <input
          type="text"
          className="w-full py-2 pl-12 pr-4 rounded-full text-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
          placeholder="Search for user"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      {searchTerm.trim() !== "" && (
        <div className="w-full flex flex-col items-center gap-6 max-w-lg scrollbar-hide overflow-y-scroll h-[28rem]">
          {filteredUsers.length === 0 ? (
            <p className="text-gray-700">No users found</p>
          ) : (
            filteredUsers.map((user) => {
              const isFriend = friendsList.includes(user._id);
              const requestSent = sentRequests.has(user._id);
              const isRequestPending =
                user.friendRequests &&
                user.friendRequests.includes(currentUserId);

              return (
                <div
                  key={user._id}
                  className="flex gap-4 items-center w-full max-w-full p-4 bg-white rounded-lg shadow-md"
                >
                  <div className="w-16 h-16 rounded-full border-4 border-blue-200 overflow-hidden shadow-lg">
                    <img
                      src={user.profilePicture || "/batman.jpg"}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-1 justify-between items-center">
                    <div className="flex flex-col">
                      <p className="text-md font-semibold text-gray-800">
                        {user.name} {user.surname}
                      </p>
                      <div className="flex items-center gap-2 text-gray-400">
                        <FaGithub className="cursor-pointer hover:text-black duration-150" />
                        <FaInstagram className="cursor-pointer hover:text-black duration-150" />
                        <CiLinkedin className="cursor-pointer hover:text-black duration-150" />
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      {isFriend ? (
                        <FaUserFriends className="text-xl text-green-400 cursor-default" />
                      ) : isRequestPending ? (
                        <BiDotsHorizontalRounded className="text-xl text-blue-500 animate-pulse" />
                      ) : (
                        <IoMdPersonAdd
                          className={`text-xl hover:text-green-400 cursor-pointer duration-150 ${
                            requestSent
                              ? "text-gray-400 cursor-not-allowed"
                              : ""
                          }`}
                          onClick={() =>
                            !requestSent && handleAddFriend(user._id)
                          }
                        />
                      )}
                      <MdReport className="text-xl hover:text-red-500 cursor-pointer duration-150" />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
