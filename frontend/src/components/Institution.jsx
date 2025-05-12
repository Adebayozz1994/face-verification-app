import React, { useState } from "react";
import axios from "axios";

const InstitutionRegister = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [registrationLink, setRegistrationLink] = useState("");

  const handleSubmit = async () => {
    if (!name || !email) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/institutions/register", {
        name,
        email,
      });

      setRegistrationLink(res.data.registrationLink);
      alert("Institution registered successfully!");
    } catch (error) {
      console.error("Error registering institution:", error);
      alert("Failed to register institution.");
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Institution Registration</h2>

      <input
        type="text"
        placeholder="Institution Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <br />
      <input
        type="email"
        placeholder="Institution Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br />
      <button onClick={handleSubmit}>Register Institution</button>

      {registrationLink && (
        <div style={{ marginTop: "20px" }}>
          <p><strong>Share this link with your users:</strong></p>
          <a href={registrationLink}>{registrationLink}</a>
        </div>
      )}
    </div>
  );
};

export default InstitutionRegister;
