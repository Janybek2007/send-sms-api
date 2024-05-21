import jwt from 'jsonwebtoken'

class TokenService {
    generateToken(payload) {
        const accessToken = jwt.sign(
            {
                phoneNumber: payload.phoneNumber,
                username: payload.username,
                avatar: payload.avatar,
                id: payload._id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '30d'
            }
        )
        return {
            accessToken
        }
    }

    validateToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_SECRET)
            return userData
        } catch (e) {
            return null
        }
    }
}

export default new TokenService()
