import express from "express";
import userController from "../app/controllers/userController.js";
const router = express.Router();

/**-------- User Routes --------**/
router.get("/dashboard", userController.dashboard);
router.get("/profile", userController.profile);
/**-------- User Routes --------**/


export default router;