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
import * as controller from "../controllers/appController.js";
import * as Ncontroller from "../controllers/NotaryAppController.js";


/** POST Methods */
router.route("/signup").post(controller.signup); // signup user in database
router.route("/notarysignup").post(Ncontroller.signupNotary); // signup notary in database
// router
//   .route("/authenticate")
//   .post(controller.verifyUser, (req, res) => res.end()); // authenticate user
router.route("/login").post(controller.login); // login in app
router.route("/notarylogin").post(Ncontroller.notarylogin)  // notary login controller
// router
  // .route("/uploadDocument")
  // .post(upload.single("pdfFile"), controller.uploadDocuments); // upload document

/** GET Methods */
router.route("/user").get(controller.getUser); // get user data
router.route("/generateOTP").post(localVariables, controller.generateOTP); // generate random OTP
router.route("/verifyOTP").post(controller.verifyOTP); // verify generated OTP

router.route("/notary").get(Ncontroller.getNotary); // get notary data
router.route("/generateOTP").post(localVariables, Ncontroller.generateOTP); // generate random OTP for notary
router.route("/verifyOTP").post(Ncontroller.verifyOTP); // verify generated OTP for notary

// router.route("/getDocuments").get(controller.getDocuments); // get all documents
// router.route("/deleteDocument/:id").delete(controller.deleteDocument); // delete document
/** PUT Methods */
router.route("/updateUser").put(Auth, controller.updateUser); // is use to update the user profile
router.route("/forgotPassword").put(controller.forgotPassword); // use to reset password
router.route("/resetPassword/:token").put(controller.resetPassword); // use to reset password

router.route("/updateNotary").put(Auth, Ncontroller.updateNotary); // is use to update the user profile
router.route("/notaryforgotPassword").put(Ncontroller.notrayforgotPassword); // use to reset password for notary
router.route("/notaryresetPassword/:token").put(Ncontroller.notaryresetPassword); // use to reset password for notary

export default router;
