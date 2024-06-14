import { Router } from "express";
import Auth, { localVariables } from "../middleware/auth.js";
const router = Router();
import multer from "multer";
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, "./public/Images");
  },
  filename: function (req, file, cb) {
    return cb(null, `${Date.now()}_${file.originalname}`);
  },
});
const upload = multer({ storage });

/** import all controllers */
import * as controller from "../controllers/userAppController.js";
import * as Ncontroller from "../controllers/NotaryAppController.js";
import * as Key from "../controllers/KeyController.js";
import * as Sign from "../controllers/SignPdf/index.js";
import * as DocR from "../controllers/DocumentRestrict.controller.js";

/** POST Methods */
router.route("/signup").post(controller.signup); // signup user in database
router.route("/login").post(controller.login); // login in app
router
  .route("/uploadDocument")
  .post(upload.single("pdfFile"), controller.uploadDocuments); // upload document

/** GET Methods */
router.route("/user").get(controller.getUser); // get user data
router.route("/generateOTP").post(localVariables, controller.generateOTP); // generate random OTP
router.route("/verifyOTP").post(controller.verifyOTP); // verify generated OTP
router.route("/getDocuments").get(Auth, controller.getDocuments); // get all documents
router.route("/getDocument/:id").get(controller.getDocumentById); // get specific document
router.route("/deleteDocument/:id").delete(Auth, controller.deleteDocument); // delete document
router
  .route("/getDocumentsAppointment")
  .get(Auth, controller.getDocumentsAppointment); // get all appointments
/** PUT Methods */
router.route("/updateUser").put(Auth, controller.updateUser); // is use to update the user profile
router.route("/forgotPassword").put(controller.forgotPassword); // use to reset password
router.route("/resetPassword/:token").put(controller.resetPassword); // use to reset password
router.route("/getNotaries").get(controller.getNotaries); // get all notaries
router.route("/getNotaries/:id").get(controller.getSpecificNotary);

/** Appointment Methods */

router.route("/createAppointment").post(Auth, controller.createAppointment); // create appointment
router.route("/unpaidAppointments").get(Auth, controller.unpaidAppointments); // get all appointments
router
  .route("/uploadPaymentReceipt")
  .post(Auth, upload.single("receipt"), controller.uploadReceipts); // upload receipt
router.route("/upcomingAppointment").get(Auth, controller.upcomingAppointments); // get all appointments
router
  .route("/unconfirmedAppointment")
  .get(Auth, controller.unconfirmedAppointment); // get all appointments
router
  .route("/UserAppointmentDetails/:id")
  .get(Auth, controller.UserAppointmentDetails); // confirm appointment

/* Notary Methods */
/* Login/Signup of Notary */
router.route("/notarysignup").post(Ncontroller.signupNotary); // signup notary in database
router.route("/notarylogin").post(Ncontroller.notarylogin); // notary login controller

/* OTP Verfication methods */
router.route("/notary").get(Ncontroller.getNotary); // get notary data
router.route("/generateOTP").post(localVariables, Ncontroller.generateOTP); // generate random OTP for notary
router.route("/verifyOTP").post(Ncontroller.verifyOTP); // verify generated OTP for notary

/* passwords */
router.route("/updateNotary").put(Auth, Ncontroller.updateNotary); // is use to update the user profile
router.route("/notaryforgotPassword").put(Ncontroller.notrayforgotPassword); // use to reset password for notary
router
  .route("/notaryresetPassword/:token")
  .put(Ncontroller.notaryresetPassword); // use to reset password for notary

/* Notary availabilities */
router.route("/AvailabilityForm").post(Auth, Ncontroller.Availability); // set the availability of notary
router.route("/NotaryAvailability").get(Auth, Ncontroller.getAvailability); // get the availability of notary
router
  .route("/EditNotaryAvailability")
  .patch(Auth, Ncontroller.editAvailability); // edit the availability of notary
export default router;

/* Notary appointments */
router
  .route("/notaryUnconfirmedAppointment")
  .get(Auth, Ncontroller.unconfirmedAppointment); // get all unconfirmed appointments
router.route("/confirmAppointment").post(Auth, Ncontroller.confirmAppointment); // confirm appointment
router
  .route("/notaryConfirmedAppointment")
  .get(Auth, Ncontroller.notaryConfirmedAppointment); // view appointment
router
  .route("/AppointmentDetails/:id")
  .get(Auth, Ncontroller.AppointmentDetails); // get all appointments

router.route("/generate-key").post(Key.generateKeyStore); // get all appointments
router
  .route("/sign-document")
  .post(Auth, upload.single("keystoreFile"), Sign.SignDoc); // get all appointments

router.route("/get-stamp/:id").get(Ncontroller.getStamp); // get all appointments

/* Document synchronization  */

router.route("/restrictDocumentEdit").post(Auth, DocR.DocumentRestrict); // restrict document edit
router
  .route("/uploadUpdatedDocument")
  .post(upload.single("pdfFile"), DocR.uploadUpdatedDocument); // upload updated document
