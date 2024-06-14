import * as React from "react";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import PDFViewer from "./PDFViewer";
import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import "./HelperStyle.css";

const CardPreview = ({ userPaymentInformation }) => {
  const [keyStoreFile, setKeyStoreFile] = useState(null);
  const [open, setOpen] = useState(false);
  const [docFile, setDocFile] = useState("");
  const [password, setPassword] = useState("");

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => setOpen(false);
  const handleSignedFileOpen = () => {
    setDocFile(true);
  };

  const handleSignedFileClose = () => {
    setDocFile(false);
  };

  const handleSessionStart = () => {
    const url = `https://notarization-session.netlify.app/?room=${
      userPaymentInformation[0].meetingId
    }&name=${encodeURIComponent(userPaymentInformation[0].meetingUserName)}`;

    window && window.open(url, "_blank");
  };

  const handleFileChange = (event) => {
    setKeyStoreFile(event.target.files[0]);
  };

  const SignDocument = async () => {
    console.log(userPaymentInformation[0].docUpdatedPath);
    console.log(keyStoreFile);
    if (!keyStoreFile) {
      alert("Please upload the keystore file before signing the document.");
      return;
    }

    const formData = new FormData();
    formData.append("keystoreFile", keyStoreFile);
    formData.append("docFilePath", userPaymentInformation[0].docUpdatedPath);
    formData.append("password", password);
    formData.append("docId", userPaymentInformation[0].docId);

    // Display the form data before sending it to the backend
    console.log("Form Data being sent to backend:");
    for (let pair of formData.entries()) {
      console.log(pair[0] + ": " + pair[1]);
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/api/sign-document",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Document signed successfully:", response.data);
    } catch (error) {
      console.error("Error signing the document:", error);
    }
  };

  return (
    <>
      {userPaymentInformation.map((user, index) => (
        <Card key={index} className="cardContainer">
          <CardMedia
            component="img"
            className="cardMedia"
            image={user.image}
            alt="Live from space album cover"
          />
          <CardContent className="cardContent">
            <Typography
              variant="h6"
              className={index % 2 === 0 ? "cardTextWhite" : "cardTextBlack"}
            >
              Name: {user.userName}
            </Typography>
            <Typography
              variant="subtitle2"
              className={index % 2 === 0 ? "cardTextWhite" : "cardTextBlack"}
            >
              Date: {user.date}
            </Typography>
            <Typography
              variant="subtitle2"
              className={index % 2 === 0 ? "cardTextWhite" : "cardTextBlack"}
            >
              Time: {user.time}
            </Typography>
          </CardContent>
          {open && (
            <PDFViewer
              docFile={user.docFile}
              docName={user.docName}
              handleClose={handleClose}
              handleOpen={handleOpen}
              open={open}
            />
          )}
          {docFile && (
            <PDFViewer
              docFile={user.docFile}
              docName={user.docName}
              handleClose={handleClose}
              handleOpen={handleOpen}
              open={open}
            />
          )}
        </Card>
      ))}
      <Button
        style={{
          backgroundColor: "#0D3343",
          color: "white",
          marginTop: "10px",
        }}
        onClick={handleOpen}
      >
        View Document
      </Button>
      <Button
        style={{
          backgroundColor: "#0D3343",
          color: "white",
          marginTop: "10px",
        }}
        onClick={handleSessionStart}
      >
        Start Session
      </Button>
      <input
        type="file"
        accept=".p12"
        id="upload-keystore-file"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      <Link
        to={`/notarize/${userPaymentInformation[0].docId}+${userPaymentInformation[0].Nid}+${userPaymentInformation[0].Nname}`}
      >
        <Button
          style={{
            backgroundColor: "#0D3343",
            color: "white",
            marginTop: "10px",
          }}
        >
          Add E-Sign/Stamp - Document
        </Button>
      </Link>

      <label htmlFor="upload-keystore-file">
        <Button
          variant="contained"
          component="span"
          style={{
            backgroundColor: "#0D3343",
            color: "white",
            marginTop: "10px",
          }}
        >
          Upload Keystore File
        </Button>
      </label>
      <input
        type="text"
        value={password}
        placeholder="Enter Your Keystore Password.."
        onChange={(e) => setPassword(e.target.value)}
        style={{
          width: "30%",
          padding: "10px",
          margin: "10px 0",
          boxSizing: "border-box",
          borderRadius: "5px",
          border: "1px solid #ccc",
          fontSize: "16px",
        }}
      />
      {/* <Button
        style={{
          backgroundColor: "#0D3343",
          color: "white",
          marginTop: "10px",
        }}
        onClick={handleOpen}
      >
        View Signed Document
      </Button> */}
      <Button
        style={{
          backgroundColor: "#0D3343",
          color: "white",
          marginTop: "10px",
        }}
        onClick={SignDocument}
      >
        Sign Document
      </Button>
    </>
  );
};

export default CardPreview;
