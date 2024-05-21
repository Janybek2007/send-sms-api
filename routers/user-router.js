import {Router} from 'express'
import userController from '../controllers/user-controller.js'
import authMiddleware from '../middlewares/auth-middleware.js'

const router = Router()

router.post('/user/create', userController.createUser)
router.get('/user/get/all', userController.userGetAll)
router.get('/user/get/current', authMiddleware, userController.getCurrentUser)
router.post('/user/generate-code', userController.generateCode)

export default router
