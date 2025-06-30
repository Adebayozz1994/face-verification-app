import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import * as faceapi from "face-api.js";
import axios from "axios";

const StudentRegister = () => {
  const { linkId } = useParams();
  const videoRef = useRef();
  // const canvasRef = useRef();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [matricNo, setMatricNo] = useState("");
  const [admissionNo, setAdmissionNo] = useState("");
  const [department, setDepartment] = useState("");
  const [descriptor, setDescriptor] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    startCamera();
    loadModels();
  }, []);

  const loadModels = async () => {
    const MODEL_URL = "/models";
    await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
    await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
    await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
    console.log("Models loaded");
  };

  const startCamera = () => {
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      videoRef.current.srcObject = stream;
    });
  };

  const captureFace = async () => {
    const detection = await faceapi
      .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detection) return alert("No face detected!");

    setDescriptor(Array.from(detection.descriptor));
    alert("Face captured successfully");
  };

  const handleSubmit = async () => {
    if (!name || !email || !matricNo || !admissionNo || !department) {
      return alert("Please fill in all fields");
    }

    if (!descriptor) return alert("Capture a face first");

    try {
      setLoading(true);
      const res = await axios.post(
        `https://face-verification-app-neon.vercel.app/api/users/register/${linkId}`,
        {
          name,
          email,
          matricNo,
          admissionNo,
          department,
          descriptor,
        }
      );

      alert(res.data.message);
    } catch (error) {
      console.error("Registration error:", error);
      alert(error.response?.data?.message || "Error registering student");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
          Student Registration
        </h2>

        <video
          ref={videoRef}
          width="480"
          height="360"
          autoPlay
          muted
          className="rounded mb-4"
        ></video>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Full Name"
          className="mb-2 w-full px-4 py-2 border rounded"
        />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="mb-2 w-full px-4 py-2 border rounded"
        />
        <input
          value={matricNo}
          onChange={(e) => setMatricNo(e.target.value)}
          placeholder="Matric Number"
          className="mb-2 w-full px-4 py-2 border rounded"
        />
        <input
          value={admissionNo}
          onChange={(e) => setAdmissionNo(e.target.value)}
          placeholder="Admission Number"
          className="mb-2 w-full px-4 py-2 border rounded"
        />

        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="mb-4 w-full px-4 py-2 border rounded"
        >
          <option value="">Select Department</option>
          <option value="Computer Science">Computer Science</option>
          <option value="Mathematics">Mathematics</option>
          <option value="Physics">Physics</option>
          <option value="Geology">Geology</option>
        </select>

        <button
          onClick={captureFace}
          className="w-full py-2 mb-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded"
        >
          Capture Face
        </button>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </div>
    </div>
  );
};

export default StudentRegister;
