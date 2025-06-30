import React, { useRef, useEffect, useState } from 'react';
import * as faceapi from 'face-api.js';
import axios from 'axios';

const LiveFaceVerifier = () => {
  const videoRef = useRef(null);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [faceMatcher, setFaceMatcher] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  // Load models
  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = '/models';
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
      await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
    };
    loadModels();
  }, []);

  // Fetch descriptors and create matcher
  useEffect(() => {
    const loadKnownFaces = async () => {
      try {
        const res = await axios.get('https://face-verification-app.onrender.com/api/users/descriptors');

        const studentMap = {};
        const labeledDescriptors = res.data.map(student => {
          studentMap[student.name] = student;
          return new faceapi.LabeledFaceDescriptors(
            student.name,
            [new Float32Array(student.descriptor)]
          );
        });

        const matcher = new faceapi.FaceMatcher(labeledDescriptors, 0.45);
        setFaceMatcher({ matcher, studentMap });
      } catch (err) {
        console.error('Error loading descriptors:', err);
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
        console.error('Camera error:', err);
        alert("Please allow camera access.");
      }
    };

    const wait = setInterval(() => {
      if (videoRef.current) {
        clearInterval(wait);
        startVideo();
      }
    }, 100);
  }, []);

  // Face detection & matching
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
            const matchedStudent = faceMatcher.studentMap[bestMatch.label];
            setStudent(matchedStudent);
            setErrorMessage("");
            clearInterval(interval); // stop scanning
          } else {
            setErrorMessage("No matching face found.");
            setStudent(null);
          }
        }
      }, 1500);
    };

    if (videoRef.current && faceMatcher) {
      videoRef.current.addEventListener('loadeddata', () => {
        setLoading(false);
        detectAndMatch();
      });
    }

    return () => clearInterval(interval);
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

      {student ? (
        <div className="mt-6 bg-green-100 text-green-900 p-4 rounded shadow text-left max-w-md mx-auto">
          <h3 className="text-xl font-bold mb-2">✅ Student Verified</h3>
          <p><strong>Name:</strong> {student.name}</p>
          <p><strong>Email:</strong> {student.email}</p>
          <p><strong>Matric Number:</strong> {student.matricNo}</p>
          <p><strong>Admission Number:</strong> {student.admissionNo}</p>
          <p><strong>Department:</strong> {student.department}</p>
        </div>
      ) : !loading && !errorMessage ? (
        <p className="mt-4 text-gray-600">Looking for a matching face...</p>
      ) : null}

      {errorMessage && <p className="mt-4 text-red-600">{errorMessage}</p>}
    </div>
  );
};

export default LiveFaceVerifier;
