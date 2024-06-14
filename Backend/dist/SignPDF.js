"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _pdfLib = require("pdf-lib");
var _nodeFs = _interopRequireDefault(require("node:fs"));
var _PDFArrayCustom = _interopRequireDefault(require("./PDFArrayCustom.js"));
var _nodeSignpdf = _interopRequireDefault(require("node-signpdf"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const signer = _nodeSignpdf.default.default || _nodeSignpdf.default;
class SignPDF {
  constructor(pdfFile, certFile, password) {
    this.pdfDoc = _nodeFs.default.readFileSync(pdfFile);
    this.certificate = _nodeFs.default.readFileSync(certFile);
    this.password = password; // Store the password
  }

  /**
   * @return Promise<Buffer>
   */
  async signPDF() {
    let newPDF = await this._addPlaceholder();
    newPDF = signer.sign(newPDF, this.certificate, {
      passphrase: this.password
    });
    return newPDF;
  }

  /**
   * @see https://github.com/Hopding/pdf-lib/issues/112#issuecomment-569085380
   * @returns {Promise<Buffer>}
   */
  async _addPlaceholder() {
    const loadedPdf = await _pdfLib.PDFDocument.load(this.pdfDoc);
    const ByteRange = _PDFArrayCustom.default.withContext(loadedPdf.context);
    const DEFAULT_BYTE_RANGE_PLACEHOLDER = "**********";
    const SIGNATURE_LENGTH = 3322;
    const pages = loadedPdf.getPages();
    ByteRange.push(_pdfLib.PDFNumber.of(0));
    ByteRange.push(_pdfLib.PDFName.of(DEFAULT_BYTE_RANGE_PLACEHOLDER));
    ByteRange.push(_pdfLib.PDFName.of(DEFAULT_BYTE_RANGE_PLACEHOLDER));
    ByteRange.push(_pdfLib.PDFName.of(DEFAULT_BYTE_RANGE_PLACEHOLDER));
    const signatureDict = loadedPdf.context.obj({
      Type: "Sig",
      Filter: "Adobe.PPKLite",
      SubFilter: "adbe.pkcs7.detached",
      ByteRange,
      Contents: _pdfLib.PDFHexString.of("A".repeat(SIGNATURE_LENGTH)),
      Reason: _pdfLib.PDFString.of("We need your signature for reasons..."),
      M: _pdfLib.PDFString.fromDate(new Date())
    });
    const signatureDictRef = loadedPdf.context.register(signatureDict);
    const widgetDict = loadedPdf.context.obj({
      Type: "Annot",
      Subtype: "Widget",
      FT: "Sig",
      Rect: [0, 0, 0, 0],
      // Signature rect size
      V: signatureDictRef,
      T: _pdfLib.PDFString.of("test signature"),
      F: 4,
      P: pages[0].ref
    });
    const widgetDictRef = loadedPdf.context.register(widgetDict);

    // Add signature widget to the first page
    pages[0].node.set(_pdfLib.PDFName.of("Annots"), loadedPdf.context.obj([widgetDictRef]));
    loadedPdf.catalog.set(_pdfLib.PDFName.of("AcroForm"), loadedPdf.context.obj({
      SigFlags: 3,
      Fields: [widgetDictRef]
    }));

    // Allows signatures on newer PDFs
    // @see https://github.com/Hopding/pdf-lib/issues/541
    const pdfBytes = await loadedPdf.save({
      useObjectStreams: false
    });
    return SignPDF.unit8ToBuffer(pdfBytes);
  }

  /**
   * @param {Uint8Array} unit8
   */
  static unit8ToBuffer(unit8) {
    let buf = Buffer.alloc(unit8.byteLength);
    const view = new Uint8Array(unit8);
    for (let i = 0; i < buf.length; ++i) {
      buf[i] = view[i];
    }
    return buf;
  }
}
exports.default = SignPDF;