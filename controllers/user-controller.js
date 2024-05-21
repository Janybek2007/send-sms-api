import {ApiError} from "../exteptions/api-error.js";
import userServices from "../services/user-services.js";
import tokenService from "../services/token-service.js";
import userModel from "../models/user-model.js";
import send_smsServices from "../services/send_sms-services.js";

class UserController {
    async createUser(req, res, next) {
        try {
            const {username, phoneNumber, avatar} = req.body
            if (!username || !phoneNumber) {
                return ApiError.BadRequest('Username or Phone number is required')
            }
            const userData = await userServices.createUser({
                username,
                phoneNumber,
                avatar
            })
            return {
                user: userData
            }
        } catch (e) {
            next(e)
        }
    }

    async getCurrentUser(req, res, next) {
        try {
            const authorizationHeader = req.headers.authorization
            const accessToken = authorizationHeader.split(' ')[1]
            const userData = tokenService.validateToken(accessToken)
            const userDBData = await userModel.findOne(
                {phoneNumber: userData.phoneNumber},
            )
            if (!userData || !userDBData) {
                return next(ApiError.UnauthorizedError())
            }
            return res.json({
                user: userDBData
            })
        } catch (e) {
            next(e)
        }
    }

    async getAllUser(req, res, next) {
        try {
            const users = await userModel.find()

            return res.json({users})
        } catch (e) {
            next(e)
        }
    }

    async generateCode(req, res, next) {
        const code = this.generateVerificationCode()
        const {phoneNumber} = req.body
        try {
            const generateCodeAndText = `Your verification code is: ${code}`
            await send_smsServices.send(generateCodeAndText, phoneNumber)
            res.status(200).send({
                message: 'Verification code sent successfully'
            })
        } catch (e) {
            next(e)
        }
    }

    generateVerificationCode() {
        const min = 100000;
        const max = 999999;
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

}

const userController = new UserController();

export default userController;
