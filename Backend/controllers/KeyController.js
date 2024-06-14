import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";
import forge from "node-forge";
import { spawnSync } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateKeyStore = async (req, res) => {
  const {
    commonName,
    countryName,
    stateName,
    localityName,
    organizationName,
    organizationalUnitName,
    uri,
    password,
  } = req.body;

  try {
    // Generate a key pair
    const keyPair = crypto.generateKeyPairSync("rsa", {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: "spki",
        format: "pem",
      },
      privateKeyEncoding: {
        type: "pkcs8",
        format: "pem",
      },
    });

    // Create a self-signed certificate
    const cert = forge.pki.createCertificate();
    cert.publicKey = forge.pki.publicKeyFromPem(keyPair.publicKey);
    cert.serialNumber = "01";
    cert.validity.notBefore = new Date();
    cert.validity.notAfter = new Date();
    cert.validity.notAfter.setFullYear(
      cert.validity.notBefore.getFullYear() + 1
    );
    const attrs = [
      { name: "commonName", value: commonName },
      { name: "countryName", value: countryName },
      { shortName: "ST", value: stateName },
      { name: "localityName", value: localityName },
      { name: "organizationName", value: organizationName },
      { shortName: "OU", value: organizationalUnitName },
    ];
    cert.setSubject(attrs);
    cert.setIssuer(attrs);
    cert.setExtensions(
      [48],
      [
        { name: "basicConstraints", cA: true },
        {
          name: "keyUsage",
          keyCertSign: true,
          digitalSignature: true,
          nonRepudiation: true,
          keyEncipherment: true,
          dataEncipherment: true,
        },
        {
          name: "extKeyUsage",
          serverAuth: true,
          clientAuth: true,
          codeSigning: true,
          emailProtection: true,
          timeStamping: true,
        },
        {
          name: "nsCertType",
          client: true,
          server: true,
          email: true,
          objsign: true,
          sslCA: true,
          emailCA: true,
          objCA: true,
        },
        {
          name: "subjectAltName",
          altNames: [{ type: 6, value: uri }],
        },
        { name: "subjectKeyIdentifier" },
      ]
    );

    // Self-sign the certificate
    cert.sign(forge.pki.privateKeyFromPem(keyPair.privateKey));

    // Convert the certificate to PEM format
    const pemCert = forge.pki.certificateToPem(cert);

    // Ensure the directory exists
    const dir = path.join(__dirname, "generated");
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }

    // Write the private key and certificate to files
    const privateKeyPath = path.join(dir, "mykey.pem");
    const certPath = path.join(dir, "cert.pem");
    const keystorePath = path.join(dir, "keystore.p12");

    fs.writeFileSync(privateKeyPath, keyPair.privateKey);
    fs.writeFileSync(certPath, pemCert);

    // Generate PKCS#12 keystore using OpenSSL command-line tool
    const opensslCmd = `openssl pkcs12 -export -out ${keystorePath} -inkey ${privateKeyPath} -in ${certPath} -passout pass:${password}`;
    const opensslArgs = opensslCmd.split(" ");
    const opensslProcess = spawnSync(opensslArgs[0], opensslArgs.slice(1), {
      encoding: "utf-8",
    });

    if (opensslProcess.status === 0) {
      res.json({
        privateKeyUrl: `/generated/mykey.pem`,
        certificateUrl: `/generated/cert.pem`,
        keystoreUrl: `/generated/keystore.p12`,
      });
    } else {
      console.error("OpenSSL error:", opensslProcess.stderr);
      res.status(500).json({ error: "Failed to generate key" });
    }
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
