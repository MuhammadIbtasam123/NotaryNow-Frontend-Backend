import SignPDF from "./SignPDF.js";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "url";
import { runCommand } from "../../helperFunctions/RunCommands.js";
import { exec } from "child_process";
import sequelize from "../../database/config.js"; // Import sequelize instance
import Document from "../../model/Document.model.js";

// Function to ensure directory exists
const ensureDirectoryExistence = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

export const SignDoc = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { docFilePath, password, docId } = req.body; // Add userId and notaryId to the request body
    const keystoreFilePath = req.file.path;

    // Extract the path after "8080" and construct the absolute path
    const modifiedFilePath = docFilePath.split("public")[1];
    const absoluteDocFilePath = path.resolve(`./public${modifiedFilePath}`);

    // Define the correct path to the SignPdf directory
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const signPdfDir = path.resolve(__dirname, "../SignPdf");

    console.log("Starting Babel command...");
    // Run Babel command
    await runCommand(`npx babel ${signPdfDir} -d ./dist`);
    console.log("Babel command completed.");

    console.log("Starting Node command...");
    // Run Node command in a detached child process
    exec("node dist/index.js", { detached: true, stdio: "ignore" }).unref();
    console.log("Node command started in a detached process.");

    console.log("Getting the keystore file path...");
    // Get the keystore file path from request (assuming it's uploaded)
    const keystorePath = path.resolve(keystoreFilePath);

    console.log("Getting the PDF file path...");
    // Get the absolute PDF file path
    const pdfPath = absoluteDocFilePath;

    console.log("Signing the PDF file...");
    // SignPDF Constructor - 1st: PDF file, 2nd: Keystore file
    const pdfBuffer = new SignPDF(pdfPath, keystorePath, password);
    const signedDocs = await pdfBuffer.signPDF();

    console.log("Exporting the signed PDF file...");
    // Ensure exports directory exists
    const exportsDir = path.resolve("./exports");
    ensureDirectoryExistence(exportsDir);

    // Exporting File in exports Folder
    const pdfName = `${exportsDir}/Signedfile_${Math.floor(
      Math.random() * 5000
    )}.pdf`;

    // Extract the numeric part from pdfName
    const numericPart = pdfName.match(/\d+/)[0]; // Extracts the first sequence of digits

    // Construct the new path in the desired format
    const newPath = `exports/Signedfile_${numericPart}`;

    // const UpdatedPath = pdfName.join("/exports/").split("/")[1];
    // Signed PDF File with Random Name
    fs.writeFileSync(pdfName, signedDocs);
    console.log(`New Signed PDF created called: ${pdfName}`);

    console.log("Storing signed document in the database...");
    // Store signed document in the database as a BLOB
    await Document.update(
      {
        documentSignedUpdated: pdfName,
        DocumentSignedData: signedDocs,
        documentSignedUpdated: newPath,
        documentName: path.basename(pdfPath),
        docStatus: true,
        signedTimestamp: new Date(),
      },
      {
        where: {
          documentId: docId,
        },
        transaction: transaction, // Assuming `transaction` is defined elsewhere
      }
    );

    await transaction.commit();

    console.log("Responding with success...");
    // Respond with success and the signed PDF path
    res
      .status(200)
      .json({ message: "Document signed successfully", signedPdf: pdfName });
  } catch (error) {
    console.error("Failed to sign document:", error);
    await transaction.rollback();
    res.status(500).json({ error: "Failed to sign document" });
  }
};
