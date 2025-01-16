"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/app/features/UserSlice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Slide } from "react-toastify";

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  


  const handleSubmit = async (e) => {
    e.preventDefault();

    toast.info("Logging in...", {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      transition: Slide,
    });

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (res.status === 200) {
        const data = await res.json();
        dispatch(setUser(data));
        localStorage.setItem("token", data.token);

        router.push("/dashboard");
      } else {
        const data = await res.json();
        setError(data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="h-screen flex bg-gray-200 justify-center items-center">
      <div className="flex">
        <div className="border-t-[3px] border-b-[3px] border-black">
          <div className="p-5 text-4xl font-extrabold bg-gradient-blue-black bg-[length:400%_400%] animate-gradient-blue-black text-transparent bg-clip-text">
            TUGU
          </div>
          <div>
            <img src="/allura.png" alt="Logo"></img>
          </div>
          <div className="w-full p-5 text-white font-light flex items-center justify-center">
            <p className="w-full text-black font-medium">
              To continue, sign to{" "}
              <span className="flex text-orange-400">Tugu-Chat</span>
            </p>
          </div>
        </div>
        <div className="bg-white p-8 gap-10 flex flex-col justify-center items-center border-t-[3px] border-b-[3px] border-black shadow-lg w-96">
          <h2 className="text-3xl font-bold mb-4 text-center text-gray-800">
            Login
          </h2>
          {error && (
            <div className="text-red-500 text-center mb-4">{error}</div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="block text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="password" className="block text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full p-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition duration-200"
            >
              Login
            </button>
          </form>
          <div>
            <Link href="/register" className="text-blue-500 hover:underline">
              No account yet?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
