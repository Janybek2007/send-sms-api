import {ApiError} from '../exteptions/api-error.js'

export default function (req, res, next) {
    try {
        const authorizationHeader = req.headers.authorization
        if (!authorizationHeader) {
            return next(ApiError.UnauthorizedError())
        }

        next()
    } catch (e) {
        return next(ApiError.UnauthorizedError())
    }
}
