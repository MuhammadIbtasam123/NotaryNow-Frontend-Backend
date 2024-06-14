import User from "../model/user.model.js";
import Notary from "../model/notary.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import otpGenerator from "otp-generator";
import { sendOTP } from "./userMailer.js";
import generateToken from "../helperFunctions/helper.js";
import { sendRedirectLink } from "./userResetMailer.js";
import Document from "../model/Document.model.js";
import NotaryAvailability from "../model/notaryAvailability.model.js";
import Appointment from "../model/Appointment.model.js";
import DayTimes from "../model/dayTime.model.js";
import Days from "../model/Days.model.js";
import TimeSlots from "../model/TimeSlots.model.js";
import Meeting from "../model/Meeting.model.js";
import path from "path";
import fs from "fs/promises";
import { fileURLToPath } from "url";
import sequelize from "../database/config.js";
import Notaries from "../model/notary.model.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const DocumentRestrict = async (req, res) => {
  try {
    console.log(req.body);
    const document = await Document.findOne({
      where: {
        documentId: req.body.documentId,
      },
    });

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    if (document) {
      const document = await Document.update(
        {
          synchoronizeFlag: req.body.synchronizeFlag,
        },
        {
          where: {
            documentId: req.body.documentId,
          },
        }
      );
    }
  } catch (error) {
    console.error("Error fetching document:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const uploadUpdatedDocument = async (req, res) => {
  // console.log(req.body);
  // console.log(req.file);
  // const pdfFile = req.file;
  // const buffer = await fs.readFile(pdfFile.path);
  // console.log(buffer);
  try {
    const { documentId, synchronizeFlag } = req.body;
    const pdfFile = req.file;

    if (!pdfFile) {
      return res.status(400).json({ message: "PDF file is required." });
    }

    const buffer = await fs.readFile(pdfFile.path);

    const document = await Document.findByPk(documentId);
    if (!document) {
      return res.status(404).json({ message: "Document not found." });
    }

    const UpdateDocument = await Document.update(
      {
        synchoronizeFlag: req.body.synchronizeFlag,
        updatedDocumnetData: buffer,
        documentdata: buffer,
        documentFileUpdated: pdfFile.path,
      },
      {
        where: {
          documentId: req.body.documentId,
        },
      }
    );

    console.log("UpdatedDocument:", UpdateDocument);

    return res.status(200).json({
      message: "PDF file uploaded and document updated successfully.",
    });
  } catch (error) {
    console.error("Error uploading updated document:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
