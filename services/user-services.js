import userModel from "../models/user-model.js";
import tokenService from "./token-service.js";

class UserServices {
    async createUser(user) {
        const userData = await userModel.create(user)
        const token = tokenService.generateToken(userData)

        return {
            token: token.accessToken,
            user: userData
        }
    }


}

const userServices = new UserServices();

export default userServices;
