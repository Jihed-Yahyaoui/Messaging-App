const userModel = require('../models/userModel')
const { validate } = require('deep-email-validator')
const { hash, compare } = require('bcrypt')
const jwt = require('jsonwebtoken')
const { transporter, mailOptions } = require('../utils/nodemailer')

module.exports = {

    // This function verifies if email is valid
    // and if email is unique
    // and creates an unverified plain user
    createUser: async (req, res) => {
        const { firstname, lastname, email, password } = req.body

        try {
            // Verify email
            const mailRes = await validate(email)
            if (!mailRes.valid)
                return res.status(400).json(
                    {
                        message: "This email is not valid.",
                        reason: "email"
                    }
                )

            // Verify email uniqueness
            const possibleDuplicateEmail = await userModel.findOne({ email })
            if (possibleDuplicateEmail?.email === email)
                return res.status(400).json({
                    message: "This email is already being used.",
                    reason: "email"
                })

            // hash password
            const hashedPwd = await hash(password, 10);

            // hash email for activation link and remove undesirable characters
            const hashedUser = await hash(process.env.SECRET_HASH + email, 10)
                .then(result => btoa(email) + '&' + result)
                .then(result => encodeURIComponent(result))
                .then(result => result.replaceAll('.', '_'))

            // Save in db
            await userModel.create({ firstname, lastname, email, password: hashedPwd })

            // Send activation email
            transporter.sendMail(mailOptions(email, hashedUser), () =>
                res.status(201).json({ message: 'success' })
            );

        } catch (error) {
            console.log(error)
            res.status(500).json({ message: "server error" })
        }
    },

    // This function creates a google user
    // No verification needed
    createOrLoginGoogleUser: async (req, res) => {
        const { email, given_name, family_name, picture } = jwt.decode(req.body.credential)

        // Verify email uniqueness
        // If email already exists, just login
        // otherwise create account
        const possibleDuplicateEmail = await userModel.findOne({ email })
        if (possibleDuplicateEmail?.email !== email)
            await userModel.create({
                firstname: given_name,
                lastname: family_name,
                email,
                profile_picture: picture,
                verified: true,
            })

        const refresh_token = jwt.sign({ id: email },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' });

        return res.status(201).json(refresh_token)
    },

    // This function checks activation link
    // And verifies user if link is valid
    activateUser: async (req, res) => {
        try {
            const { hash } = req.params
            const [cryptedEmail, secretHash] = hash.split('&')
            const email = atob(cryptedEmail)

            // Decode and check hash validity
            const isHashValid = await
                compare(process.env.SECRET_HASH + email,
                    decodeURIComponent(secretHash.replaceAll('_', '.')))

            if (!isHashValid || !email)
                return res.status(404).json({ message: "This link is not valid." })

            // Check if user exists 
            const activatingUser = await userModel.findOne({ email })
            if (!activatingUser)
                return res.status(404).json({ message: "User does not exists." })


            // User should not be already verified
            if (activatingUser.verified)
                return res.status(400).json({ message: "User is already activated." })

            // verifying user and sending access token and refresh token
            activatingUser.verified = true
            const access_token = jwt.sign({ email },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '10m' });

            const refresh_token = jwt.sign({ email },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: '1d' });

            await activatingUser.save().then(() =>
                res.status(200).json({ access_token, refresh_token }))

        } catch (err) {
            console.log(err)
            res.status(500).json({ message: "server error" })
        }
    },

    // This function checks if user exists and is verified
    // And logs them in
    logInUser: async (req, res) => {
        try {
            const { id, password } = req.body
            const logInUser = await userModel.findOne({ email: id })

            // Check if user exists
            if (!logInUser)
                return res.status(404).json({ message: "This user does not exists.", reason: "id" })

            // Check if password is valid
            const isPwdCorrect = await compare(password, logInUser.password)
            if (!isPwdCorrect)
                return res.status(401).json({ message: "This password is incorrect.", reason: "password" })

            // ckeck if user is verified
            if (!logInUser.verified)
                return res.status(401).json({ message: "This user is not activated.", reason: "id" })

            // Send access token and refresh token
            const access_token = jwt.sign({ id },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '1h' });

            const refresh_token = jwt.sign({ id },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: '1d' });

            return res.status(200).json({ access_token, refresh_token })

        } catch (err) {
            console.log(err)
            res.status(500).json({ message: "server error" })
        }
    },
    getUser: async (req, res) => {
        const access_token = res.locals.newAccess_token || req.headers.access_token
        const id = jwt.decode(access_token)?.id || jwt.decode(access_token)?.email
        const user = await userModel.findOne({ email: id })
            .select('_id firstname lastname profile_picture')
        res.status(200).json({ user, access_token })
    },

    searchUser: async (req, res) => {
        const { search } = req.params
        const searchRegex = new RegExp(search, 'i')

        const searchResult = await userModel.find({
            $or: [{ firstname: searchRegex }, { lastname: searchRegex }]
        }).limit(5).select('_id firstname lastname profile_picture')

        res.status(200).json({ searchResult })
    }
}