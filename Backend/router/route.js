import { Router } from "express";
import Auth, { localVariables } from "../middleware/auth.js";
const router = Router();

/** import all controllers */
import * as controller from "../controllers/appController.js";

/** POST Methods */
router.route("/signup").post(controller.signup); // signup user in database
// router
//   .route("/authenticate")
//   .post(controller.verifyUser, (req, res) => res.end()); // authenticate user
router.route("/login").post(controller.login); // login in app

/** GET Methods */
router.route("/user/:username").get(controller.getUser); // get user data
router
  .route("/generateOTP")
  .get(controller.verifyUser, localVariables, controller.generateOTP); // generate random OTP
// router.route('/verifyOTP').get(controller.verifyUser, controller.verifyOTP) // verify generated OTP
// router.route('/createResetSession').get(controller.createResetSession) // reset all the variables

/** PUT Methods */
router.route("/updateuser").put(Auth, controller.updateUser); // is use to update the user profile
// router
//   .route("/resetPassword")
//   .put(controller.verifyUser, controller.resetPassword); // use to reset password

export default router;
