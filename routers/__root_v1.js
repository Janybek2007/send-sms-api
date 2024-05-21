import express from 'express'
import userController from "../controllers/user-controller.js";
import authMiddleware from "../middlewares/auth-middleware.js";

const apiRouterV1 = express.Router()

apiRouterV1.post("/user/create", userController.createUser);
apiRouterV1.get("/user/get/current", authMiddleware, userController.getCurrentUser);
apiRouterV1.get("/user/get/all", userController.getAllUser);
apiRouterV1.get("/user/generate-code", userController.generateCode);


export default apiRouterV1;
