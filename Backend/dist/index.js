"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SignDoc = void 0;
var _SignPDF = _interopRequireDefault(require("./SignPDF.js"));
var _nodeFs = _interopRequireDefault(require("node:fs"));
var _nodePath = _interopRequireDefault(require("node:path"));
var _url = require("url");
var _RunCommands = require("../../helperFunctions/RunCommands.js");
var _child_process = require("child_process");
var _config = _interopRequireDefault(require("../../database/config.js"));
var _DocumentModel = _interopRequireDefault(require("../../model/Document.model.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
// Import sequelize instance

// Function to ensure directory exists
const ensureDirectoryExistence = dirPath => {
  if (!_nodeFs.default.existsSync(dirPath)) {
    _nodeFs.default.mkdirSync(dirPath, {
      recursive: true
    });
  }
};
const SignDoc = async (req, res) => {
  const transaction = await _config.default.transaction();
  try {
    const {
      docFilePath,
      password,
      docId
    } = req.body; // Add userId and notaryId to the request body
    const keystoreFilePath = req.file.path;

    // Extract the path after "8080" and construct the absolute path
    const modifiedFilePath = docFilePath.split("public")[1];
    const absoluteDocFilePath = _nodePath.default.resolve(`./public${modifiedFilePath}`);

    // Define the correct path to the SignPdf directory
    const __filename = (0, _url.fileURLToPath)(import.meta.url);
    const __dirname = _nodePath.default.dirname(__filename);
    const signPdfDir = _nodePath.default.resolve(__dirname, "../SignPdf");
    console.log("Starting Babel command...");
    // Run Babel command
    await (0, _RunCommands.runCommand)(`npx babel ${signPdfDir} -d ./dist`);
    console.log("Babel command completed.");
    console.log("Starting Node command...");
    // Run Node command in a detached child process
    (0, _child_process.exec)("node dist/index.js", {
      detached: true,
      stdio: "ignore"
    }).unref();
    console.log("Node command started in a detached process.");
    console.log("Getting the keystore file path...");
    // Get the keystore file path from request (assuming it's uploaded)
    const keystorePath = _nodePath.default.resolve(keystoreFilePath);
    console.log("Getting the PDF file path...");
    // Get the absolute PDF file path
    const pdfPath = absoluteDocFilePath;
    console.log("Signing the PDF file...");
    // SignPDF Constructor - 1st: PDF file, 2nd: Keystore file
    const pdfBuffer = new _SignPDF.default(pdfPath, keystorePath, password);
    const signedDocs = await pdfBuffer.signPDF();
    console.log("Exporting the signed PDF file...");
    // Ensure exports directory exists
    const exportsDir = _nodePath.default.resolve("./exports");
    ensureDirectoryExistence(exportsDir);

    // Exporting File in exports Folder
    const pdfName = `${exportsDir}/Signedfile_${Math.floor(Math.random() * 5000)}.pdf`;

    // Extract the numeric part from pdfName
    const numericPart = pdfName.match(/\d+/)[0]; // Extracts the first sequence of digits

    // Construct the new path in the desired format
    const newPath = `exports/Signedfile_${numericPart}`;

    // const UpdatedPath = pdfName.join("/exports/").split("/")[1];
    // Signed PDF File with Random Name
    _nodeFs.default.writeFileSync(pdfName, signedDocs);
    console.log(`New Signed PDF created called: ${pdfName}`);
    console.log("Storing signed document in the database...");
    // Store signed document in the database as a BLOB
    await _DocumentModel.default.update({
      documentSignedUpdated: pdfName,
      DocumentSignedData: signedDocs,
      documentSignedUpdated: newPath,
      documentName: _nodePath.default.basename(pdfPath),
      docStatus: true,
      signedTimestamp: new Date()
    }, {
      where: {
        documentId: docId
      },
      transaction: transaction // Assuming `transaction` is defined elsewhere
    });
    await transaction.commit();
    console.log("Responding with success...");
    // Respond with success and the signed PDF path
    res.status(200).json({
      message: "Document signed successfully",
      signedPdf: pdfName
    });
  } catch (error) {
    console.error("Failed to sign document:", error);
    await transaction.rollback();
    res.status(500).json({
      error: "Failed to sign document"
    });
  }
};
exports.SignDoc = SignDoc;