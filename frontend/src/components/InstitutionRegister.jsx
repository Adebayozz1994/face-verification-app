import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import * as faceapi from "face-api.js";
import axios from "axios";

const RegisterForm = () => {
  const { linkId } = useParams();
  const videoRef = useRef();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [matricNo, setMatricNo] = useState("");
  const [admissionNo, setAdmissionNo] = useState("");
  const [department, setDepartment] = useState("");
  const [descriptor, setDescriptor] = useState(null);
  const [loadingModels, setLoadingModels] = useState(true);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [registrationComplete, setRegistrationComplete] = useState(false);

  useEffect(() => {
    const init = async () => {
      await loadModels();
      startCamera();
    };
    init();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const loadModels = async () => {
    try {
      await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
      await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
      await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
      console.log("Face API models loaded");
    } catch (error) {
      console.error("Error loading models:", error);
    } finally {
      setLoadingModels(false);
    }
  };

  const startCamera = () => {
    if (videoRef.current?.srcObject) return;

    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((err) => {
        console.error("Camera error:", err);
        setMessageType("error");
        setMessage("Please allow camera access.");
      });
  };

  const captureFace = async () => {
    if (!videoRef.current) return;

    const detection = await faceapi
      .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detection) {
      setMessageType("error");
      setMessage("No face detected! Please try again.");
      return;
    }

    setDescriptor(Array.from(detection.descriptor));
    setMessageType("success");
    setMessage("Face captured successfully.");
  };

  const handleSubmit = async () => {
    if (!name || !email || !matricNo || !admissionNo || !department || !descriptor) {
      setMessageType("error");
      setMessage("Please fill all fields and capture your face.");
      return;
    }

    try {
      const res = await axios.post(
        `https://face-verification-app-neon.vercel.app/api/students/register/${linkId}`,
        {
          name,
          email,
          matricNo,
          admissionNo,
          department,
          descriptor,
        }
      );

      setMessageType("success");
      setMessage(res.data.message || "Registration successful!");
      setRegistrationComplete(true);
    } catch (error) {
      console.error("Registration error:", error);
      setMessageType("error");
      setMessage(error.response?.data?.message || "Error registering student.");
    }
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setMatricNo("");
    setAdmissionNo("");
    setDepartment("");
    setDescriptor(null);
    setMessage("");
    setMessageType("");
    setRegistrationComplete(false);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-purple-100 to-indigo-100 p-4 overflow-hidden">
      {/* Faculty Check Warning */}
      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded-md shadow-md mb-2 w-full max-w-lg">
        <p className="text-sm font-medium">
          ⚠️ Please ensure you're registering under the correct{" "}
          <strong>Faculty</strong> before proceeding.
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg overflow-y-auto h-full">
        <h2 className="text-2xl font-semibold text-center mb-4 text-gray-800">
          Register as a Student
        </h2>

        {/* Message Banner */}
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

        {/* Registration Complete View */}
        {registrationComplete ? (
          <div className="text-center space-y-4 mt-10">
            <h3 className="text-xl font-semibold text-green-700">
              🎉 Registration Successful!
            </h3>
            <p className="text-gray-600">
              Would you like to register another student?
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={resetForm}
                className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
              >
                Register Another Student
              </button>
              <button
                onClick={() => window.location.href = "/"}
                className="px-6 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition"
              >
                Close
              </button>
            </div>
          </div>
        ) : loadingModels ? (
          <p className="text-center text-gray-500">
            Loading face recognition models...
          </p>
        ) : (
          <>
            {/* Camera Preview */}
            <div className="mb-4">
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="rounded-md shadow-md w-full max-h-40 sm:max-h-64 object-cover"
              />
            </div>

            {/* Form Inputs */}
            <div className="space-y-3">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                type="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              <input
                value={matricNo}
                onChange={(e) => setMatricNo(e.target.value)}
                placeholder="Matric Number"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              <input
                value={admissionNo}
                onChange={(e) => setAdmissionNo(e.target.value)}
                placeholder="Admission Number"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="">Select Department</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Physics">Physics</option>
                <option value="Geology">Geology</option>
              </select>

              <button
                onClick={captureFace}
                className="w-full py-2 px-4 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md font-medium transition"
              >
                Capture Face
              </button>

              <button
                onClick={handleSubmit}
                className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-semibold transition"
              >
                Register
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RegisterForm;
