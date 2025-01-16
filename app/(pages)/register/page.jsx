"use client"
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Register = () => {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    surname: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          name: formData.name,
          surname: formData.surname,
          password: formData.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.message);
      } else {
        setSuccess(true);
        router.push("/login")
        
        console.log("User registered:", result);
      }
    } catch (error) {
      setError("An error occurred during registration.");
      console.error("Registration error:", error);
    }
  };

  return (
    <div className="h-screen flex bg-gray-200 justify-center items-center">
      <div className="flex">
        <div className="border-t-[3px] border-b-[3px] border-black">
          <div className="p-5 text-4xl font-extrabold bg-gradient-green-black bg-[length:400%_400%] animate-gradient-green-black text-transparent bg-clip-text">
            TUGU
          </div>

          <div className="mt-14">
            <img src="/allura.png" alt="Logo"></img>
          </div>
          <div className="w-full p-5 mt-10 text-white font-light flex justify-center">
            <p className="text-black font-medium">
              To continue, register and sign in to{" "}
              <span className="flex text-orange-400 justify-center">
                Tugu-Chat
              </span>
            </p>
          </div>
        </div>
        <div className="bg-white p-8 border-t-[3px] border-b-[3px] border-black shadow-lg w-96">
          <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
            Register
          </h2>
          {error && (
            <p className="text-red-500 text-center mb-4">{error}</p>
          )}
          {success && (
            <p className="text-green-500 text-center mb-4">
              Registration successful!
            </p>
          )}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="block text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="name" className="block text-gray-700">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="surname" className="block text-gray-700">
                Surname
              </label>
              <input
                type="text"
                id="surname"
                name="surname"
                value={formData.surname}
                onChange={handleChange}
                className="w-full p-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                value={formData.password}
                onChange={handleChange}
                className="w-full p-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="confirmPassword" className="block text-gray-700">
                Password Again
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full p-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full p-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition duration-200"
            >
              Register
            </button>
          </form>
          <div className="mt-4">
            <Link
              href="/login"
              className="text-blue-500 flex justify-center hover:underline"
            >
              Already have an account?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
