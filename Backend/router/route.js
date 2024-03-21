import { Router } from "express";
const router = Router();

/** import all controllers */
import * as controller from "../controllers/appController.js";
// import Auth, { localVariables } from "../middleware/auth.js";

/** POST Methods */
router.route("/register").post(controller.register); // register user in database
router.route("/login").post(controller.verifyUser, controller.login); // login in app

export default router;
