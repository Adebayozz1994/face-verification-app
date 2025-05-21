import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import * as faceapi from "face-api.js";
import axios from "axios";

const RegisterForm = () => {
  const { linkId } = useParams();
  const videoRef = useRef();
  const canvasRef = useRef();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [descriptor, setDescriptor] = useState(null);

  useEffect(() => {
    startCamera();
    loadModels();
  }, []);

  const loadModels = async () => {
    await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
    await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
    await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
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

    if (!detection) {
      alert("No face detected!");
      return;
    }

    setDescriptor(Array.from(detection.descriptor));
    alert("Face captured successfully");
  };

  const handleSubmit = async () => {
    if (!descriptor) return alert("Capture a face first");
    if (!name || !email) return alert("Please fill in all fields");

    try {
      const res = await axios.post(`http://localhost:5000/api/users/register/${linkId}`, {
        name,
        email,
        descriptor,
      });

      alert(res.data.message);
    } catch (error) {
      console.error("Registration error:", error);
      alert("Error registering user");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">Register Under Institution</h2>

        <div className="mb-4">
          <video ref={videoRef} width="100%" height="auto" autoPlay muted className="rounded-md shadow-md" />
          <canvas ref={canvasRef} style={{ display: "none" }} />
        </div>

        <div className="space-y-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full Name"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />

          <button
            onClick={captureFace}
            className="w-full py-2 px-4 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md font-medium transition"
          >
            Capture Face
          </button>

          <button
            onClick={handleSubmit}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
