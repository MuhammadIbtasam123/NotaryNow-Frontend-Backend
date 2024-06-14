import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { fabric } from "fabric";
import { PDFDocument, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import alluraFont from "../../../assets/images/Allura-Regular.ttf";

function EditPdfView() {
  const { docid } = useParams();
  const [pdfData, setPdfData] = useState(null);
  const [Notaryname, setNotaryname] = useState(null);
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const pdfEmbedRef = useRef(null);

  useEffect(() => {
    fetchPdf();
    restrictDocumentEdit(true);
  }, [docid]);

  const fetchPdf = async () => {
    const DocId = docid.split("+")[0];
    const notaryName = docid.split("+")[1];
    setNotaryname(decodeURIComponent(notaryName));
    try {
      const response = await axios.get(
        `http://localhost:8080/api/getDocument/${DocId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          responseType: "arraybuffer",
        }
      );
      setPdfData(response.data);
    } catch (error) {
      console.error("Error fetching PDF:", error);
    }
  };

  const restrictDocumentEdit = async (flag) => {
    const DocId = docid.split("+")[0];
    try {
      await axios.post(
        `http://localhost:8080/api/restrictDocumentEdit`,
        { documentId: DocId, synchronizeFlag: flag },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
    } catch (error) {
      console.error("Error restricting document edit:", error);
    }
  };

  const arrayBufferToBase64 = (buffer) => {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  useEffect(() => {
    if (canvasRef.current && !canvas) {
      const newCanvas = new fabric.Canvas(canvasRef.current);
      setCanvas(newCanvas);
    }
  }, [canvas]);

  useEffect(() => {
    if (pdfEmbedRef.current) {
      pdfEmbedRef.current.addEventListener("load", () => {
        const embedElement = pdfEmbedRef.current;
        const canvasElement = canvasRef.current;
        if (embedElement && canvasElement) {
          const embedWidth = embedElement.clientWidth;
          const embedHeight = embedElement.clientHeight;
          canvasElement.width = embedWidth;
          canvasElement.height = embedHeight;
          if (canvas) {
            canvas.setWidth(embedWidth);
            canvas.setHeight(embedHeight);
          }
        }
      });
    }
  }, [pdfData, canvas]);

  const addSignature = () => {
    if (!canvas) return;
    const text = new fabric.Text(Notaryname, {
      left: 40,
      top: 300,
      fontSize: 20,
      fontFamily: "Allura",
      fill: "black",
      selectable: true,
    });
    canvas.add(text);
    canvas.renderAll();
  };

  const saveAndReleaseDocument = async () => {
    if (!canvas || !pdfData) return;

    try {
      const pdfDoc = await PDFDocument.load(pdfData);
      pdfDoc.registerFontkit(fontkit);

      const [page] = pdfDoc.getPages();
      const pageHeight = page.getHeight();
      const canvasObjects = canvas.getObjects();

      const alluraBytes = await fetch(alluraFont).then((res) =>
        res.arrayBuffer()
      );
      const alluraFontEmbed = await pdfDoc.embedFont(alluraBytes);

      for (const obj of canvasObjects) {
        if (obj.type === "text") {
          const { text, left, top, fontSize, fill } = obj;
          const y = pageHeight - top;
          page.drawText(text, {
            x: left,
            y,
            size: fontSize,
            color: rgb(0, 0, 0),
            font: alluraFontEmbed,
          });
        }
      }

      const modifiedPdfData = await pdfDoc.save();
      await uploadUpdatedDocument(modifiedPdfData);

      await restrictDocumentEdit(false);
    } catch (error) {
      console.error("Error saving and releasing document:", error);
    }
  };

  const uploadUpdatedDocument = async (pdfData) => {
    const DocId = docid.split("+")[0];
    try {
      const formData = new FormData();
      formData.append(
        "pdfFile",
        new Blob([pdfData], { type: "application/pdf" })
      );
      formData.append("documentId", DocId);
      formData.append("synchronizeFlag", false);

      console.log(formData);

      const response = await axios.post(
        `http://localhost:8080/api/uploadUpdatedDocument`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        console.log("Document UPdated success!");
      }
    } catch (error) {
      console.error("Error uploading updated document:", error);
    }
  };

  return (
    <div style={{ display: "flex", position: "relative", width: "75vw" }}>
      <div style={{ position: "relative", zIndex: 1, width: "95%" }}>
        {pdfData ? (
          <embed
            ref={pdfEmbedRef}
            src={`data:application/pdf;base64,${arrayBufferToBase64(pdfData)}`}
            width="100%"
            height="800px"
            style={{ border: "1px solid black" }}
          />
        ) : (
          <p>Loading PDF...</p>
        )}
      </div>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 2,
          pointerEvents: "none",
          width: "100%",
        }}
      >
        <canvas ref={canvasRef} />
      </div>
      <div style={{ marginLeft: "20px", zIndex: 3 }}>
        <button
          style={{
            marginBottom: "20px",
            backgroundColor: "#0D3343",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
          onClick={addSignature}
        >
          Add Signature
        </button>
        <button
          style={{
            marginBottom: "20px",
            backgroundColor: "#0D3343",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
          onClick={saveAndReleaseDocument}
        >
          Save and Release Document
        </button>
      </div>
    </div>
  );
}

export default EditPdfView;
