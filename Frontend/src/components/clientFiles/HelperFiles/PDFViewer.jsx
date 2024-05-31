import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const PDFViewer = ({ docFile, docName, handleClose, handleOpen, open }) => {
  const [numPages, setNumPages] = useState(null);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  return (
    <>
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            width: "40%",
            height: "80%",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            overflow: "auto",
            borderRadius: "10px",
            border: "2px solid #000",
          }}
        >
          <Document file={docFile} onLoadSuccess={onDocumentLoadSuccess}>
            {Array.from(new Array(numPages), (_, index) => (
              <Page
                key={`page_${index + 1}`}
                pageNumber={index + 1}
                renderTextLayer={false}
              />
            ))}
          </Document>
        </Box>
      </Modal>
    </>
  );
};

export default PDFViewer;
