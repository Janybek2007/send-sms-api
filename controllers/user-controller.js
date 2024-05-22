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
            return res.status(200).json(userData)
        } catch (e) {
            next(e)
        }
    }

    async getCurrentUser(req, res, next) {
        try {
            const userId = req.headers.authorization
            const userDBData = await userModel.findById(userId)
            if (!userDBData) {
                return ApiError.UnauthorizedError()
            }
            return res.status(200).json({
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
            const data = await send_smsServices.send(codeAndText, to)

            res.status(200).json({
                message: 'Successfully generated code',
                code,
                data
            })
        } catch (e) {
            next(e)
        }
    }

    async updateUser(req, res, next) {
        try {
            const userId = req.headers.authorization;
            const {username, avatar, phoneNumber} = req.body;

            const userDBData = await userModel.findByIdAndUpdate(userId, {username, avatar, phoneNumber}, {new: true});

            if (!userDBData) {
                return res.status(401).json({error: "User not found"});
            }

            return res.status(200).json({message: "User updated successfully", user: userDBData});
        } catch (e) {
            // Pass error to error handling middleware
            next(e);
        }
    }

}

export default new UserController()
