import React from "react";

const Dashboard = ({ institution }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(institution.registrationLink);
    alert("Link copied to clipboard!");
  };

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
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
