import express from "express";
import userController from "../../controllers/user-controller.js";
import authMiddleware from "../../middlewares/auth-middleware.js";


const router = express.Router();

router.post("/user/create", userController.createUser);
router.get("/user/get/current", authMiddleware, userController.getCurrentUser);
router.get("/user/get/all", userController.getAllUser);
router.get("/user/generate-code", userController.generateCode);

export default router;
