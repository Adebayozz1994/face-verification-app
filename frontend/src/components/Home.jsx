// RegisterPage.js
import React, { useState, useEffect, useRef } from "react";
import * as faceapi from "face-api.js";
import axios from "axios";

const RegisterPage = () => {
  const videoRef = useRef();
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
  };

  const startCamera = () => {
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      videoRef.current.srcObject = stream;
    });
  };

  const captureFace = async () => {
    const detections = await faceapi
      .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detections) return alert("No face detected!");
    setDescriptor(Array.from(detections.descriptor));
    alert("Face captured");
  };

  const handleSubmit = async () => {
    if (!descriptor) return alert("Capture a face first");

    const res = await axios.post("http://localhost:5000/api/users/register", {
      name,
      email,
      descriptor,
    });
    alert(res.data.message);
  };

  return (
    <div>
      <h2>Register</h2>
      <video ref={videoRef} width="480" height="360" autoPlay muted></video>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
      />
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <button onClick={captureFace}>Capture Face</button>
      <button onClick={handleSubmit}>Register</button>
    </div>
  );
};

export default RegisterPage;
