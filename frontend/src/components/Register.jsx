import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import axios from "axios";

const Register = () => {
  const videoRef = useRef();
  const canvasRef = useRef();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [descriptor, setDescriptor] = useState(null);
  const [mode, setMode] = useState("register"); 

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

    if (mode === "register") {
      const res = await axios.post("http://localhost:5000/api/users/register", {
        name,
        email,
        descriptor,
      });
      alert(res.data.message);
    } else {
      const res = await axios.post("http://localhost:5000/api/users/verify", {
        descriptor,
      });
      if (res.data.success) {
        alert("User matched: " + res.data.user.name);
        alert("User email: " + res.data.user.email)
      } else {
        alert("No match found");
        alert("try to register first")
      }
    }
  };

  return (
    <div className="App" style={{ textAlign: "center" }}>
      <h2>Face {mode === "register" ? "Registration" : "Verification"}</h2>

      <video ref={videoRef} width="480" height="360" autoPlay muted></video>
      <canvas ref={canvasRef} style={{ display: "none" }} />

      {mode === "register" && (
        <>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        </>
      )}

      <br />
      <button onClick={captureFace}>Capture Face</button>
      <button onClick={handleSubmit}>
        {mode === "register" ? "Register" : "Verify"}
      </button>
      <br />
      <button onClick={() => setMode(mode === "register" ? "verify" : "register")}>
        Switch to {mode === "register" ? "Verify" : "Register"} Mode
      </button>
    </div>
  );
};

export default Register;
