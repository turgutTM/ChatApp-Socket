"use client";
import React, { useEffect, useState } from "react";
import Chat from "@/app/components/chat";
import Info from "@/app/components/info";
import Sidebar from "@/app/components/sidebar";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/app/features/UserSlice";
import ClipLoader from "react-spinners/ClipLoader";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
const Dashboard = () => {
  const user = useSelector((state) => state.user.user);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedComponent, setSelectedComponent] = useState("profile");
  const [selectedProfileId, setSelectedProfileId] = useState("");
  const [selectedProfileData, setSelectedProfileData] = useState(null);
  const dispatch = useDispatch();
  const router = useRouter();
 

  useEffect(() => {
    if (user && user._id) {
      setSelectedProfileId(user._id);
    }
  }, [user]);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("No token found. Please log in.");
        }

        const response = await fetch("/api/current-user", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch current user.");
        }

        const data = await response.json();
        setUserData(data);
        dispatch(setUser(data));
      } catch (err) {
        console.error(err);
        toast.error("You need to login again.", { position: "top-center" });
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, [dispatch, router]);

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center bg-[#1f1e1e]">
        <ClipLoader color="#ffffff" loading={loading} size={50} />
      </div>
    );
  if (error) return <p className="text-center text-white">{error}</p>;

  return (
    <div className="flex h-screen bg-[#1f1e1e] p-2">
      <div>
        <Sidebar
          setSelectedComponent={setSelectedComponent}
          setSelectedProfileId={setSelectedProfileId}
        />
      </div>
      <div className="flex w-full gap-2">
        <div className="w-full">
          <Chat
            setSelectedProfileId={setSelectedProfileId}
            selectedProfileId={selectedProfileId}
            setSelectedProfileData={setSelectedProfileData}
            selectedProfileData={selectedProfileData}
            userData={userData}
          />
        </div>
        <div className="w-[29%]">
          <Info
            userData={userData}
            selectedComponent={selectedComponent}
            selectedProfileId={selectedProfileId}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
