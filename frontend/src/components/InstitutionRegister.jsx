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
    <div style={{ textAlign: "center" }}>
      <h2>Register Under Institution</h2>

      <video ref={videoRef} width="480" height="360" autoPlay muted></video>
      <canvas ref={canvasRef} style={{ display: "none" }} />

      <div style={{ marginTop: "20px" }}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Full Name"
        />
        <br />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <br />
        <button onClick={captureFace} style={{ marginTop: "10px" }}>
          Capture Face
        </button>
        <br />
        <button onClick={handleSubmit} style={{ marginTop: "10px" }}>
          Register
        </button>
      </div>
    </div>
  );
};

export default RegisterForm;
