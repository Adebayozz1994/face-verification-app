import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import axios from "axios";

const Verify = () => {
  const videoRef = useRef(null);
  const [mode, setMode] = useState("video"); // "capture" or "video"
  const [descriptor, setDescriptor] = useState(null);
  const [faceMatcher, setFaceMatcher] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load face-api models
  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = "/models"; // Make sure this points to your public/models folder
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
      ]);
      console.log("Face API models loaded");
    };

    loadModels().catch((err) => {
      console.error("Error loading models:", err);
    });
  }, []);

  // Load known face descriptors from backend
  useEffect(() => {
    const loadKnownFaces = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users/descriptors");

        const userMap = {};
        const labeledDescriptors = res.data.map((user) => {
          userMap[user.name] = user;
          return new faceapi.LabeledFaceDescriptors(
            user.name,
            [new Float32Array(user.descriptor)]
          );
        });

        const matcher = new faceapi.FaceMatcher(labeledDescriptors, 0.45);
        setFaceMatcher({ matcher, userMap });
      } catch (err) {
        console.error("Error loading known descriptors:", err);
      }
    };

    loadKnownFaces();
  }, []);

  // Start webcam
  useEffect(() => {
    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Webcam error:", err);
      }
    };

    const wait = setInterval(() => {
      if (videoRef.current) {
        clearInterval(wait);
        startVideo();
      }
    }, 100);
  }, []);

  // Detect and match face live
  useEffect(() => {
    let interval;

    const detectAndMatch = () => {
      interval = setInterval(async () => {
        if (!videoRef.current || !faceMatcher) return;

        const detection = await faceapi
          .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceDescriptor();

        if (detection) {
          const bestMatch = faceMatcher.matcher.findBestMatch(detection.descriptor);

          if (bestMatch.label !== "unknown") {
            const matchedUser = faceMatcher.userMap[bestMatch.label];
            setUser({ name: matchedUser.name, email: matchedUser.email });
            setErrorMessage("");
            clearInterval(interval); // Stop once matched
          } else {
            setErrorMessage("No matching face found in the database.");
            setUser(null);
          }
        }
      }, 1500);
    };

    if (videoRef.current && faceMatcher) {
      videoRef.current.addEventListener("loadeddata", () => {
        setLoading(false);
        detectAndMatch();
      });
    }

    return () => clearInterval(interval);
  }, [faceMatcher]);

  // Capture face descriptor
  const captureFace = async () => {
    const detections = await faceapi
      .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detections) return alert("No face detected!");
    setDescriptor(Array.from(detections.descriptor));
    alert("Face captured");
  };

  // Verify captured face via backend
  const verifyCapturedFace = async () => {
    if (!descriptor) return alert("Capture a face first!");

    try {
      const res = await axios.post("http://localhost:5000/api/users/verify", {
        descriptor,
      });

      if (res.data.success) {
        alert(`User matched:\nName: ${res.data.user.name}\nEmail: ${res.data.user.email}`);
      } else {
        alert("No match found, try registering first");
      }
    } catch (err) {
      console.error("Error verifying face:", err);
    }
  };

  return (
    <div className="verify-page" style={{ textAlign: "center" }}>
      <h2>Face Verification</h2>

      <video ref={videoRef} width="480" height="360" autoPlay muted />

      <div>
        {mode === "capture" && (
          <div>
            <button onClick={captureFace}>Capture Face for Verification</button>
            <button onClick={verifyCapturedFace}>Verify Captured Face</button>
          </div>
        )}

        {mode === "video" && (
          <div>
            {loading ? (
              <p>Loading models and starting video...</p>
            ) : (
              <p>Looking for a matching face...</p>
            )}
            {user && <p>User Verified: {user.name} ({user.email})</p>}
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
          </div>
        )}

        <button onClick={() => setMode(mode === "video" ? "capture" : "video")}>
          Switch to {mode === "video" ? "Capture Face" : "Live Video"} Mode
        </button>
      </div>
    </div>
  );
};

export default Verify;
