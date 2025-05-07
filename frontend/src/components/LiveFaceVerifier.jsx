import React, { useRef, useEffect, useState } from 'react';
import * as faceapi from 'face-api.js';
import axios from 'axios';

const LiveFaceVerifier = () => {
  const videoRef = useRef(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [faceMatcher, setFaceMatcher] = useState(null);
  const [errorMessage, setErrorMessage] = useState(""); // New state for error message

  // Load face-api models
  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = '/models';
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
      await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
    };
    loadModels();
  }, []);

  // Load known face descriptors from backend
  useEffect(() => {
    const loadKnownFaces = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/users/descriptors');

        // Create a name-to-user lookup map
        const userMap = {};
        const labeledDescriptors = res.data.map(user => {
          userMap[user.name] = user; // Save full user by name
          return new faceapi.LabeledFaceDescriptors(
            user.name,
            [new Float32Array(user.descriptor)]
          );
        });

        const matcher = new faceapi.FaceMatcher(labeledDescriptors, 0.45); // 0.45 is strict
        setFaceMatcher({ matcher, userMap }); // Store both matcher and map
      } catch (err) {
        console.error('Error loading known descriptors:', err);
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
        console.error('Webcam error:', err);
      }
    };
    const wait = setInterval(() => {
      if (videoRef.current) {
        clearInterval(wait);
        startVideo();
      }
    }, 100);
  }, []);

  // Detect and match face
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

          if (bestMatch.label !== 'unknown') {
            const matchedUser = faceMatcher.userMap[bestMatch.label];
            setUser({ name: matchedUser.name, email: matchedUser.email });
            setErrorMessage(""); // Clear any error message if a match is found
            clearInterval(interval); // Stop the detection once a match is found
          } else {
            setErrorMessage("No matching face found in the database."); // Set error message if no match
            setUser(null); // Clear any previous user data
          }
        }
      }, 1500); // Check every 1.5 seconds
    };

    if (videoRef.current && faceMatcher) {
      videoRef.current.addEventListener('loadeddata', () => {
        setLoading(false);
        detectAndMatch();
      });
    }

    return () => clearInterval(interval); // Clean up the interval
  }, [faceMatcher]);

  return (
    <div className="p-4 text-center">
      <h2 className="text-2xl font-bold mb-4">Live Face Verification</h2>

      <video
        ref={videoRef}
        autoPlay
        muted
        width="480"
        height="360"
        className="mx-auto rounded shadow"
      />

      {loading && <p>Loading models and starting camera...</p>}

      {user ? (
        <div className="mt-4 p-4 bg-green-100 text-green-800 rounded">
          <h3 className="text-xl font-semibold">User Verified</h3>
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
        </div>
      ) : !loading ? (
        <p className="mt-4 text-gray-600">Looking for a matching face...</p>
      ) : null}

      {/* Display error message if no match is found */}
      {errorMessage && <p className="mt-4 text-red-600">{errorMessage}</p>}
    </div>
  );
};

export default LiveFaceVerifier;
