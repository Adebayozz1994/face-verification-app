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
      const MODEL_URL = "/models";
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
        const res = await axios.get("https://face-verification-app.onrender.com/api/users/descriptors");

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
      console.log("Starting live face detection...");
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
      // Wait for video to play
      setTimeout(() => {
        setLoading(false);
        detectAndMatch();
      }, 1000); // Delay to ensure video is ready
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
      const res = await axios.post("https://face-verification-app.onrender.com/api/users/verify", {
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
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-6">
      <h2 className="text-3xl font-semibold text-indigo-700 mb-6">Face Verification</h2>

      <video
        ref={videoRef}
        width="480"
        height="360"
        autoPlay
        muted
        playsInline
        className="rounded-lg shadow-lg border-4 border-indigo-300 mb-6"
      />

      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-md text-center space-y-4">
        {mode === "capture" && (
          <div className="flex flex-col gap-4">
            <button
              onClick={captureFace}
              className="bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              Capture Face for Verification
            </button>
            <button
              onClick={verifyCapturedFace}
              className="bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
            >
              Verify Captured Face
            </button>
          </div>
        )}

        {mode === "video" && (
          <div className="space-y-3">
            {loading ? (
              <p className="text-gray-500 italic">Loading models and starting video...</p>
            ) : (
              <p className="text-indigo-600 font-medium">Looking for a matching face...</p>
            )}
            {user && (
              <div className="text-green-700 font-semibold">
                User Verified:
                <div>
                  <strong className="underline">Name: {user.name}</strong>
                </div>
                <div>
                  <strong>Email: {user.email}</strong>
                </div>
              </div>
            )}
            {errorMessage && <p className="text-red-600 font-medium">{errorMessage}</p>}
          </div>
        )}

        <button
          onClick={() => setMode(mode === "video" ? "capture" : "video")}
          className="mt-4 px-4 py-2 rounded-lg border border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white transition"
        >
          Switch to {mode === "video" ? "Capture Face" : "Live Video"} Mode
        </button>
      </div>
    </div>
  );
};

export default Verify;
