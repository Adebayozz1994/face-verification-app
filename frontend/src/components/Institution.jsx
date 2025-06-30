import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminRegister = () => {
  const [name, setName] = useState("");
  const [faculty, setFaculty] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [registrationLink, setRegistrationLink] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!name || !faculty || !email || !password) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const res = await axios.post("https://face-verification-app-neon.vercel.app/api/admins/register", {
        name,
        faculty,
        email,
        password,
      });

      setRegistrationLink(res.data.registrationLink);
      alert("Admin registered successfully!");

      // Optionally wait a few seconds before navigating:
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      console.error("Error registering admin:", error.response?.data || error.message);
      alert("Failed to register admin.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-indigo-100 via-white to-purple-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
          Register Admin
        </h2>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          />

          <input
            type="text"
            placeholder="Faculty"
            value={faculty}
            onChange={(e) => setFaculty(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          />

          <input
            type="email"
            placeholder="Institution Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Create Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-indigo-600 hover:underline"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-3 rounded-xl transition font-semibold"
          >
            Register Admin
          </button>
        </div>

        {registrationLink && (
          <div className="mt-6 text-center">
            <p className="text-gray-600 font-medium">
              Share this link with your users:
            </p>
            <a
              href={registrationLink}
              className="text-indigo-600 underline break-all mt-2 inline-block"
              target="_blank"
              rel="noopener noreferrer"
            >
              {registrationLink}
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminRegister;
