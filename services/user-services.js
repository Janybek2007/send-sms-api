import userModel from "../models/user-model.js";

class UserServices {
    async createUser(user) {
        const userData = await userModel.create(user)
        return {
            user: userData,
        }
    }
}


export default new UserServices();
