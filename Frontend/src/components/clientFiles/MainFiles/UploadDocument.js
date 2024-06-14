import React, { useState, useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

import "./mainFiles.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UploadDocument = () => {
  const [documents, setDocuments] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  const showToast = (message, type) => {
    toast[type](message, {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/getDocuments",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/pdf",
          },
        }
      );
      if (response.data.documents.length === 0 && response.data.documents) {
        showToast("No documents found!", "info");
        return;
      }
      setDocuments(response.data.documents);
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  const handleFileSelect = (event) => {
    console.log(event);
    setSelectedFile(event.target.files[0]);
  };

  const handleFileUpload = async () => {
    const formData = new FormData();
    formData.append("pdfFile", selectedFile);
    if (!selectedFile) {
      console.error("No file selected.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/api/uploadDocument",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setDocuments([...documents, response.data.document]);
    } catch (error) {
      console.error("Error uploading document:", error);
    }
  };

  const handleDeleteDocument = async (document) => {
    // console.log(document.documentId);
    const id = document.documentId;
    try {
      const response = await axios.delete(
        `http://localhost:8080/api/deleteDocument/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      // console.log(response.data.documents);
      setDocuments(response.data.documents);
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  return (
    <Box>
      <Box className="container">
        <Typography variant="h5" className="uploadTitle">
          Upload Document
        </Typography>
        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CloudUploadIcon style={{ marginRight: "0.5rem" }} />
          <label htmlFor="fileInput" className="fileInputLabel">
            Upload File
          </label>
          <input
            type="file"
            id="fileInput"
            accept="application/pdf"
            onChange={(e) => handleFileSelect(e)}
            className="uploadFileButton"
            formEncType="multipart/form-data"
          />
        </Box>
        <Button onClick={handleFileUpload} variant="contained" color="primary">
          Submit
        </Button>
      </Box>
      <Box className="documentListContainer">
        <Typography className="documentHeaders">Document Name</Typography>
      </Box>
      <Box>
        {documents.map((document) => (
          <Box key={document.id} className="documentItem">
            <Typography>{document.documentName}</Typography>
            <Button
              className="deleteButton"
              onClick={() => {
                handleDeleteDocument(document);
              }}
            >
              <DeleteIcon /> Delete
            </Button>
          </Box>
        ))}
      </Box>

      <ToastContainer />
    </Box>
  );
};

export default UploadDocument;
