import React from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const DocumentDropdown = ({
  documents,
  selectedDocumentId,
  setSelectedDocumentId,
}) => {
  const handleDocumentSelect = (event) => {
    setSelectedDocumentId(event.target.value);
  };

  return (
    <FormControl fullWidth variant="outlined" margin="normal">
      <InputLabel id="document-label">Select Document</InputLabel>
      <Select
        labelId="document-label"
        id="document"
        value={selectedDocumentId}
        onChange={handleDocumentSelect}
        label="Select Document"
      >
        <MenuItem value="">
          <em>Select a document</em>
        </MenuItem>
        {documents.map((document, idx) => (
          <MenuItem key={idx} value={document.documentId}>
            {document.documentName}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default DocumentDropdown;
