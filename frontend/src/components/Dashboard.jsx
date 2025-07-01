import React, { useEffect, useState } from "react";
import axios from "axios";
import Verify from "./Verify"; // Update path if needed

const Dashboard = ({ admin: propAdmin }) => {
  const [admin, setAdmin] = useState(propAdmin || null);
  const [loading, setLoading] = useState(!propAdmin);
  const [showVerify, setShowVerify] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' or 'error'

  const handleCopy = () => {
    if (admin?.registrationLink) {
      navigator.clipboard.writeText(admin.registrationLink);
      setMessage("Link copied to clipboard!");
      setMessageType("success");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminId");
    window.location.reload();
  };

  useEffect(() => {
    if (propAdmin) return;

    const adminId = localStorage.getItem("adminId");
    if (!adminId) {
      setMessage("No admin ID found. Please log in.");
      setMessageType("error");
      return;
    }

    const fetchAdmin = async () => {
      try {
        const res = await axios.get(
          `https://face-verification-app.onrender.com/api/admins/dashboard/${adminId}`
        );
        setAdmin(res.data);
      } catch (error) {
        console.error("Dashboard fetch error:", error);
        setMessage("Failed to load dashboard.");
        setMessageType("error");
      } finally {
        setLoading(false);
      }
    };

    fetchAdmin();
  }, [propAdmin]);

  if (loading)
    return (
      <div className="text-center mt-10 text-gray-600">
        Loading dashboard...
      </div>
    );
  if (!admin)
    return (
      <div className="text-center mt-10 text-red-600">
        Admin not found.
      </div>
    );

  if (showVerify) {
    return (
      <div className="min-h-screen bg-gradient-to-tr from-indigo-100 to-purple-100 flex flex-col items-center justify-center p-4">
        <button
          onClick={() => setShowVerify(false)}
          className="mb-6 px-6 py-2 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition"
        >
          ← Back to Dashboard
        </button>
        <Verify admin={admin} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-tr from-indigo-100 to-purple-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-2xl rounded-3xl p-8 max-w-xl w-full overflow-y-auto">
        <h1 className="text-3xl font-bold text-indigo-700 mb-4 text-center">
          Welcome, {admin?.name || "Admin"}!
        </h1>

        {/* UI Message */}
        {message && (
          <div
            className={`p-3 rounded-md text-sm mb-4 ${
              messageType === "success"
                ? "bg-green-100 text-green-800 border-l-4 border-green-500"
                : "bg-red-100 text-red-800 border-l-4 border-red-500"
            }`}
          >
            {message}
          </div>
        )}

        <p className="text-gray-600 text-center mb-6">
          Here's your faculty admin dashboard
        </p>

        <div className="space-y-4">
          {/* Admin Email */}
          <div className="bg-indigo-50 p-4 rounded-xl border-l-4 border-indigo-500">
            <h3 className="text-sm text-gray-500">Admin Email</h3>
            <p className="text-indigo-800 font-medium">{admin.email}</p>
          </div>

          {/* Faculty */}
          <div className="bg-blue-50 p-4 rounded-xl border-l-4 border-blue-500">
            <h3 className="text-sm text-gray-500">Faculty</h3>
            <p className="text-blue-800 font-medium">{admin.faculty}</p>
          </div>

          {/* Registration Link */}
          <div className="bg-purple-50 p-4 rounded-xl border-l-4 border-purple-500">
            <h3 className="text-sm text-gray-500 mb-1">
              Student Registration Link
            </h3>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <p className="text-purple-800 font-medium break-all w-full">
                {admin.registrationLink}
              </p>
              <button
                onClick={handleCopy}
                className="text-sm text-purple-600 hover:underline"
              >
                Copy Link
              </button>
            </div>
          </div>

          {/* Registered Students */}
          <div className="bg-green-50 p-4 rounded-xl border-l-4 border-green-500">
            <h3 className="text-sm text-gray-500 mb-2">Registered Students</h3>
            {admin.students?.length > 0 ? (
              <ul className="list-decimal list-inside text-green-800 space-y-4">
                {admin.students.map((student, index) => (
                  <li key={student._id}>
                    <div>
                      <strong>ID:</strong> {index + 1}
                    </div>
                    <div>
                      <strong>Name:</strong> {student.name}
                    </div>
                    <div>
                      <strong>Email:</strong> {student.email}
                    </div>
                    <div>
                      <strong>Admission No:</strong> {student.admissionNo}
                    </div>
                    <div>
                      <strong>Department:</strong> {student.department}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-green-700">No students registered yet.</p>
            )}
          </div>
        </div>

        {/* Buttons */}
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
