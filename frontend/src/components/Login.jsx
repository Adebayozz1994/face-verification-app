import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await axios.post("https://face-verification-app-neon.vercel.app/api/admins/login", {
        email,
        password,
      });

      const adminData = res.data.admin;

      // Save token and admin ID to localStorage
      localStorage.setItem("adminId", adminData.id);
      localStorage.setItem("adminToken", res.data.token);

      alert("Login successful!");

      // Navigate to admin dashboard
      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-indigo-100 via-white to-purple-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
          Admin Login
        </h2>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          />

          <button
            onClick={handleLogin}
            className="w-full bg-indigo-500 text-white py-3 rounded-xl font-semibold hover:bg-indigo-600 transition"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
