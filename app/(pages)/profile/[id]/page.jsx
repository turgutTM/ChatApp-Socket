"use client";
import React, { useState, useEffect } from "react";
import { MdOutlineModeEdit, MdSave } from "react-icons/md";
import { useSelector } from "react-redux";
import ClipLoader from "react-spinners/ClipLoader";
import { UploadButton } from "@/app/utils/uploadthing";

const Profile = ({ profileId }) => {
  const [profileData, setProfileData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [about, setAbout] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");
  const user = useSelector((state) => state.user.user);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/user/${profileId}`);
        if (response.ok) {
          const data = await response.json();
          setProfileData(data);
          setAbout(data.about || "");
          setProfilePhoto(data.profilePhoto || "");
        } else {
          console.error("Failed to fetch profile data.");
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (profileId) {
      fetchProfile();
    }
  }, [profileId]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    try {
      const response = await fetch(`/api/update-user/${profileId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ about, profilePhoto }),
      });

      if (response.ok) {
        const data = await response.json();
        setProfileData(data);
        setIsEditing(false);
      } else {
        console.error("Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleProfilePhotoUpload = (res) => {
    console.log("Profile photo uploaded: ", res);
    setProfilePhoto(res[0].url);
    alert("Profile Photo Upload Completed");
  };

  if (loading)
    return (
      <div className="flex h-full items-center justify-center bg-gradient-to-r from-[#ffffff] to-[#ffffff] rounded-3xl">
        <ClipLoader color="#000000" loading={loading} size={50} />
      </div>
    );

  return (
    <div className="bg-gradient-to-r from-[#ffffff] to-[#ffffff] rounded-3xl h-full">
      <div className="flex flex-col h-full items-center gap-2">
        <div className="mt-3 flex items-center justify-between pl-4 pr-4 w-full">
          <p className="text-xl font-extralight">
            {user._id === profileId
              ? "Your Profile"
              : `${profileData.name}'s Profile`}
          </p>

          {user._id === profileId && !isEditing ? (
            <MdOutlineModeEdit
              className="text-2xl cursor-pointer"
              onClick={handleEditClick}
            />
          ) : (
            isEditing && (
              <MdSave
                className="text-2xl cursor-pointer"
                onClick={handleSaveClick}
              />
            )
          )}
        </div>
        <div className="mt-16 border-black border-[3px] rounded-full w-44 h-44 relative">
          <img
            className="w-full h-full object-cover rounded-full"
            src={profilePhoto || "/profilephoto.jpg"}
          />
        </div>
        {user._id === profileId && isEditing && (
          <div className="mt-4">
            <UploadButton
              endpoint="imageUploader"
              onClientUploadComplete={handleProfilePhotoUpload}
              onUploadError={(error) => {
                alert(`ERROR! ${error.message}`);
              }}
            />
          </div>
        )}

        <div className="flex gap-1">
          <p className="text-2xl font-semibold">{profileData.name || "Name"}</p>{" "}
          <p className="text-2xl font-semibold">
            {profileData.surname || "Surname"}
          </p>{" "}
        </div>
        <div className="text-sm  w-full flex flex-col gap-1 p-4">
          <p className="font-semibold w-full text-lg">About:</p>
          {isEditing ? (
            <div>
              <textarea
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                className="bg-gray-100 p-2 rounded-2xl w-full h-24"
                maxLength={150}
              />
              <p className="text-sm text-gray-500">
                {about.length}/150 characters
              </p>
            </div>
          ) : (
            <p className="bg-gray-100 p-2 rounded-2xl">
              {about || "No about information available."}
            </p>
          )}
        </div>
        <div className="h-full flex items-center gap-5 ">
          <img className="w-[5rem]" src="/insta.webp"></img>
          <img className="w-12 bg-white" src="/githubb.webp"></img>
          <img className="w-16" src="/linkedlnn.webp"></img>
        </div>
      </div>
    </div>
  );
};

export default Profile;
