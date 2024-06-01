import React, { useState } from "react";
import "./App.css";

const Session = () => {
  const [name, setName] = useState("");
  const [proceedClicked, setProceedClicked] = useState(false);

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleProceedClick = () => {
    // Disable the button and input field
    setProceedClicked(true);
  };

  const handleKeyPress = (e) => {
    // Listen for Enter key press
    if (e.key === "Enter" && name && !proceedClicked) {
      // Simulate click on Proceed button
      handleProceedClick();
    }
  };

  const URLGenerator = (name) => {
    // Function to generate a room id with format xxx-xxx-xxx
    // const generateRoomId = () => {
    //   let roomId = "";
    //   const characters = "abcdefghijklmnopqrstuvwxyz";
    //   for (let i = 0; i < 3; i++) {
    //     for (let j = 0; j < 3; j++) {
    //       roomId += characters.charAt(
    //         Math.floor(Math.random() * characters.length)
    //       );
    //     }
    //     if (i < 2) roomId += "-";
    //   }
    //   return roomId;
    // };

    //const roomId = generateRoomId();
    const roomId = "tvn-qrn-vld";

    // Generate the URL with room id and name
    const url = `https://notarization-session.netlify.app/?room=${roomId}&name=${encodeURIComponent(
      name
    )}`;

    return url;
  };

  return (
    <div
      style={{
        backgroundColor: "teal",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2 style={{ margin: "0", marginBottom: "20px", color: "#000" }}>
          To proceed with notarization, confirm your username:
        </h2>
        <input
          type="text"
          value={name}
          onChange={handleNameChange}
          onKeyPress={handleKeyPress} // Listen for Enter key press
          disabled={proceedClicked}
          style={{
            marginBottom: "20px",
            padding: "10px",
            width: "100%",
            boxSizing: "border-box",
            borderRadius: "5px",
            border: "1px solid #ccc",
            cursor: proceedClicked ? "not-allowed" : "auto",
          }}
        />
        <button
          onClick={handleProceedClick}
          disabled={!name || proceedClicked}
          style={{
            padding: "10px 20px",
            backgroundColor: proceedClicked ? "#89b6be" : "#1d5863",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: proceedClicked ? "not-allowed" : "pointer",
          }}
        >
          Proceed
        </button>
        {proceedClicked && (
          <p style={{ marginTop: "20px" }}>
            <a href={URLGenerator(name)}>
              Click here to proceed with notarization session
            </a>
          </p>
        )}
      </div>
    </div>
  );
};
