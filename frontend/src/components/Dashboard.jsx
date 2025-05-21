import React, { useEffect, useState } from "react";
import axios from "axios";
import Verify from "./Verify"; // Adjust the path if Verify is elsewhere

const Dashboard = ({ institution: propInstitution }) => {
  const [institution, setInstitution] = useState(propInstitution || null);
  const [loading, setLoading] = useState(!propInstitution);
  const [showVerify, setShowVerify] = useState(false);  // <-- new state

  const handleCopy = () => {
    if (institution?.registrationLink) {
      navigator.clipboard.writeText(institution.registrationLink);
      alert("Link copied to clipboard!");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("institutionId");
    window.location.reload();
  };

  useEffect(() => {
    if (institution) return;

    const institutionId = localStorage.getItem("institutionId");
    if (!institutionId) {
      alert("No institution ID found. Please log in.");
      return;
    }

    const fetchInstitution = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/institutions/dashboard/${institutionId}`
        );
        console.log("Fetched institution data:", res.data);
        setInstitution(res.data);
      } catch (error) {
        console.error("Dashboard fetch error:", error);
        alert("Failed to load dashboard.");
      } finally {
        setLoading(false);
      }
    };

    fetchInstitution();
  }, [institution]);

  if (loading) return <div className="text-center mt-10 text-gray-600">Loading dashboard...</div>;
  if (!institution) return <div className="text-center mt-10 text-red-600">Institution not found.</div>;

  // If toggled to show face verification:
  if (showVerify) {
    return (
      <div className="min-h-screen bg-gradient-to-tr from-indigo-100 to-purple-100 flex flex-col items-center justify-center p-4">
        <button
          onClick={() => setShowVerify(false)}
          className="mb-6 px-6 py-2 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition"
        >
          ← Back to Dashboard
        </button>
        <Verify />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-tr from-indigo-100 to-purple-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-2xl rounded-3xl p-8 max-w-xl w-full">
        <h1 className="text-3xl font-bold text-indigo-700 mb-4 text-center">
          Welcome, {institution.name}!
        </h1>

        <p className="text-gray-600 text-center mb-6">
          Here's your institution’s dashboard
        </p>

        <div className="space-y-4">
          <div className="bg-indigo-50 p-4 rounded-xl border-l-4 border-indigo-500">
            <h3 className="text-sm text-gray-500">Institution Email</h3>
            <p className="text-indigo-800 font-medium">{institution.email}</p>
          </div>

          <div className="bg-purple-50 p-4 rounded-xl border-l-4 border-purple-500">
            <h3 className="text-sm text-gray-500">Registration Link</h3>
            <p className="text-purple-800 font-medium break-words">
              {institution.registrationLink}
            </p>
            <button
              onClick={handleCopy}
              className="mt-2 text-sm text-purple-600 hover:underline"
            >
              Copy Link
            </button>
          </div>

          {/* Users List */}
          <div className="bg-green-50 p-4 rounded-xl border-l-4 border-green-500">
            <h3 className="text-sm text-gray-500 mb-2">Registered Users</h3>
            {institution.users && institution.users.length > 0 ? (
              <ul className="list-disc list-inside text-green-800">
                {institution.users.map((user) => (
                  <li key={user._id} className="pl-2 mb-2">
                    <div><strong>Name:</strong> {user.name}</div>
                    <div><strong>Email:</strong> {user.email}</div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-green-700">No users registered yet.</p>
            )}
          </div>
        </div>

        {/* New button to open Verify */}
        <button
          onClick={() => setShowVerify(true)}
          className="mt-6 w-full bg-indigo-600 text-white py-2 rounded-xl font-semibold hover:bg-indigo-700 transition"
        >
          Face Verification
        </button>

        <button
          onClick={handleLogout}
          className="mt-4 w-full bg-red-500 text-white py-2 rounded-xl font-semibold hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
