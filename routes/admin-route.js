import express from "express";
import adminController from "../app/controllers/adminController.js";
const router = express.Router();


/**-------- Admin Routes --------**/
router.get("/dashboard", adminController.dashboard);
router.get("/profile", adminController.profile);
/**-------- Admin Routes --------**/


export default router;