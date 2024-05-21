import tokenService from "../services/token-service.js";
import userModel from "../models/user-model.js";
import {ApiError} from "../exteptions/api-error.js";
import userServices from "../services/user-services.js";
import send_smsServices from "../services/send_sms-services.js";
import generateVerificationCode from "../helpers/generateCode.js";


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

    async userGetAll(req, res, next) {
        try {
            const users = await userModel.find()
            return res.status(200).json({users})
        } catch (e) {
            next(e)
        }
    }

    async generateCode(req, res, next) {
        try {
            const {to} = req.body
            const code = generateVerificationCode()
            const codeAndText = `Your verification code is: ${code}`
            await send_smsServices.send(to, codeAndText)

            res.status(200).send({
                message: 'Successfully generated code'
            })
        } catch (e) {
            next(e)
        }
    }
}

export default new UserController()
