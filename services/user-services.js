import userModel from "../models/user-model.js";
import tokenService from "./token-service.js";

class UserServices {
    async createUser(user) {
        const userData = await userModel.create(user)
        const token = tokenService.generateToken(user)
        return {
            user: userData,
            token: token.accessToken
        }
    }
}


export default new UserServices();
