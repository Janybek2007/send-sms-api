import express from 'express'
import userRouters from "./v1/user-routers.js";

const apiRouterV1 = express.Router()

apiRouterV1.use(userRouters)

export default apiRouterV1;
