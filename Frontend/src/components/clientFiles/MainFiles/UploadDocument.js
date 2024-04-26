import React, { useState, useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { Document, Page } from "react-pdf"; // Import react-pdf
import Modal from "@mui/material/Modal"; // Import modal component
import "./mainFiles.css";

const UploadDocument = () => {
  const [documents, setDocuments] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [openModal, setOpenModal] = useState(false); // State to manage modal open/close
  const [pdfUrl, setPdfUrl] = useState(""); // State to store PDF URL for modal

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/getDocuments"
      );
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
            "Content-Type": "application/pdf",
          },
        }
      );

      setDocuments([...documents, response.data.document]);
    } catch (error) {
      console.error("Error uploading document:", error);
    }
  };

  const handleDocumentClick = (pdfUrl) => {
    setPdfUrl(pdfUrl);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
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
            onChange={(e) => handleFileSelect(e)}
            className="uploadFileButton"
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
          <Box
            key={document.id}
            className="documentItem"
            onClick={() => handleDocumentClick(document.pdfUrl)}
          >
            <Typography>{document.documentName}</Typography>
            <Button className="deleteButton">
              <DeleteIcon /> Delete
            </Button>
          </Box>
        ))}
      </Box>

      {/* Modal for PDF Viewer */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          style={{
            width: "80vw",
            marginTop: "10vh",
            height: "80vh",
            margin: "auto",
            outline: "yellow solid 2px",
          }}
        >
          <Document file={pdfUrl}>
            <Page pageNumber={1} width={800} />
          </Document>
        </Box>
      </Modal>
    </Box>
  );
};

export default UploadDocument;

// import React, { useState, useEffect } from "react";
// import { Box, Typography, Button } from "@mui/material";
// import CloudUploadIcon from "@mui/icons-material/CloudUpload";
// import DeleteIcon from "@mui/icons-material/Delete"; // Import the delete icon
// import axios from "axios";
// import "./mainFiles.css";

// const UploadDocument = () => {
//   const [documents, setDocuments] = useState([]);
//   const [selectedFile, setSelectedFile] = useState(null); // State to store the selected file

//   useEffect(() => {
//     fetchDocuments();
//   }, []);

//   const fetchDocuments = async () => {
//     try {
//       const response = await axios.get(
//         "http://localhost:8080/api/getDocuments"
//       );
//       setDocuments(response.data.documents);
//     } catch (error) {
//       console.error("Error fetching documents:", error);
//     }
//   };

//   const handleFileSelect = (event) => {
//     setSelectedFile(event.target.files[0]); // Store the selected file in state
//   };

//   const handleFileUpload = async () => {
//     const formData = new FormData();
//     formData.append("pdfFile", selectedFile);
//     if (!selectedFile) {
//       console.error("No file selected.");
//       return;
//     }
//     console.log(selectedFile);

//     try {
//       const response = await axios.post(
//         "http://localhost:8080/api/uploadDocument",
//         formData,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//             "Content-Type": "application/pdf",
//           },
//         }
//       );

//       // Update documents state with the newly uploaded document
//       setDocuments([...documents, response.data.document]);
//     } catch (error) {
//       console.error("Error uploading document:", error);
//     }
//   };

//   // const handleDocumentDelete = async (documentId) => {
//   //   try {
//   //     await axios.delete(
//   //       `http://localhost:8080/api/deleteDocument/${documentId}`
//   //     );

//   //     // Filter out the deleted document from the documents state
//   //     const updatedDocuments = documents.filter(
//   //       (document) => document.id !== documentId
//   //     );
//   //     setDocuments(updatedDocuments);
//   //   } catch (error) {
//   //     console.error("Error deleting document:", error);
//   //   }
//   // };

//   return (
//     <Box>
//       <Box className="container">
//         <Typography variant="h5" className="uploadTitle">
//           Upload Document
//         </Typography>
//         {/* Input element for file upload */}
//         <Box
//           style={{
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//           }}
//         >
//           <CloudUploadIcon style={{ marginRight: "0.5rem" }} />
//           <label htmlFor="fileInput" className="fileInputLabel">
//             Upload File
//           </label>
//           <input
//             type="file"
//             id="fileInput"
//             onChange={handleFileSelect}
//             className="uploadFileButton"
//           />
//         </Box>
//         {/* Submit button to upload the selected file */}
//         <Button onClick={handleFileUpload} variant="contained" color="primary">
//           Submit
//         </Button>
//       </Box>

//       <Box className="documentListContainer">
//         <Typography className="documentHeaders">Document Name</Typography>
//         {/* <Typography className="documentHeaders">Linked Appointment</Typography> */}
//       </Box>

//       <Box>
//         {documents.map((document) => (
//           <Box key={document.id} className="documentItem">
//             <Typography>{document.documentName}</Typography>
//             {/* Delete button with delete icon */}
//             <Button
//               // onClick={() => handleDocumentDelete(document.id)}
//               className="deleteButton"
//             >
//               <DeleteIcon /> Delete
//             </Button>
//           </Box>
//         ))}
//       </Box>
//     </Box>
//   );
// };

// export default UploadDocument;
