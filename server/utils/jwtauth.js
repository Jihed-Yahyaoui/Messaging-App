const jwt = require('jsonwebtoken')
const userModel = require('../models/userModel')

// This middleware verifies refresh token validity
// And sends a new access token in case it expired
module.exports = async function jwtauth(req, res, next) {
    const { access_token, refresh_token } = req.headers

    // Verify if refresh token is valid or has not expired
    try {
        jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET)
    } catch (err) {
        if (err.name === 'TokenExpiredError')
            return res.status(406).json({ message: "expired" })
        return res.status(401).json({ message: "Unauthorized" })
    }

    // Verify if access token is valid
    // Token could be plain token with id or google token
    const id = jwt.decode(access_token)?.id || jwt.decode(access_token)?.email
    const logInUser = await userModel.findOne({ $or: [{ username: id }, { email: id }] })
    // Check if user exists
    if (!logInUser)
        return res.status(401).json({ message: "Unauthorized" })

    // See if token expired
    // And renew it if true
    const expirationDate = new Date(jwt.decode(access_token).exp * 1000)
    const now = new Date()
    if (now > expirationDate) {
        const newAccess_token = jwt.sign({ id },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '1h' });
        res.locals.newAccess_token = newAccess_token
    }
    next()
        

}
