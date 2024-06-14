import React, { useState } from "react";
import axios from "axios";
import { Container, TextField, Button, Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const GeneratePrivateKey = () => {
  const [formData, setFormData] = useState({
    commonName: "",
    countryName: "",
    stateName: "",
    localityName: "",
    organizationName: "",
    organizationalUnitName: "",
    uri: "",
    password: "",
  });

  const [fileUrls, setFileUrls] = useState({
    privateKeyUrl: "",
    certificateUrl: "",
    keystoreUrl: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8080/api/generate-key",
        formData
      );

      console.log(response.data);

      setFileUrls({
        privateKeyUrl: response.data.privateKeyUrl,
        certificateUrl: response.data.certificateUrl,
        keystoreUrl: response.data.keystoreUrl,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container
      maxWidth="sm"
      style={{
        paddingBottom: "5rem",
      }}
    >
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Generate Keystore
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="Common Name"
            name="commonName"
            value={formData.commonName}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Country Name"
            name="countryName"
            value={formData.countryName}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="State Name"
            name="stateName"
            value={formData.stateName}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Locality Name"
            name="localityName"
            value={formData.localityName}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Organization Name"
            name="organizationName"
            value={formData.organizationName}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Organizational Unit Name"
            name="organizationalUnitName"
            value={formData.organizationalUnitName}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="URI"
            name="uri"
            value={formData.uri}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <Button variant="contained" color="primary" type="submit" fullWidth>
            Generate Key
          </Button>
        </form>
        {fileUrls.privateKeyUrl && (
          <Box mt={4}>
            <Typography variant="h6">Download Links</Typography>
            <a
              href={`http://localhost:8080${fileUrls.privateKeyUrl}`}
              download="mykey.pem"
            >
              Download Private Key
            </a>
            <br />
            <a
              href={`http://localhost:8080${fileUrls.certificateUrl}`}
              download="cert.pem"
            >
              Download Certificate
            </a>
            <br />
            <a
              href={`http://localhost:8080${fileUrls.keystoreUrl}`}
              download="keystore.p12"
            >
              Download Keystore
            </a>
          </Box>
        )}
      </Box>
      <Link to="/LoginNotary">
        <Button variant="contained" color="primary" fullWidth>
          Go To Login
        </Button>
      </Link>
    </Container>
  );
};

export default GeneratePrivateKey;
