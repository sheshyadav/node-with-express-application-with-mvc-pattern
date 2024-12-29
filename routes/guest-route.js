import express from "express";
import guestController from "../app/controllers/guestController.js";
import authController from "../app/controllers/authController.js";
import { loginValidator, registerValidator, passwordValidator } from "../app/validator/index.js";
import { guest, auth } from "../app/middlewares/authentication.js";
import doubleCsrf from "../config/csrf.js";
const { doubleCsrfProtection } = doubleCsrf;

const router = express.Router();

/**-------- Auth Routes --------**/
router.get("/login", guest, authController.loginView);
router.post("/login", doubleCsrfProtection, guest, loginValidator, authController.login);
router.get("/register", guest, authController.registerView);
router.post("/register", doubleCsrfProtection, guest, registerValidator, authController.register);
router.get("/verify", auth, authController.verify);
router.get("/verify-email/:token", authController.verifyEmail);
router.post("/email/resend", doubleCsrfProtection, auth, authController.resendVerificationlink);
router.get("/password/reset", guest, authController.sendResetLinkView);
router.post("/password/reset", doubleCsrfProtection, guest, authController.sendResetLink);
router.get("/reset-password/:token", guest, authController.resetPasswordView);
router.post("/reset-password/:token", doubleCsrfProtection, guest, passwordValidator, authController.resetPassword);
router.get("/logout", auth, authController.logout);
/**-------- Auth Routes --------**/


/**-------- Default Routes --------**/
router.get("/", guestController.welcome);
router.get("/about", guestController.about);
router.get("/pricing", guestController.pricing);
/**-------- Default Routes --------**/


/**-------- Error Routes --------**/
router.get('/403', guestController.pageAccessDenied);
router.get('*', guestController.pageNotFound);
/**-------- Error Routes --------**/

export default router;