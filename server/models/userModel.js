const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    email: String,
    password: {
        type: String,
        default: ""
    },
    verified: {
        type: Boolean,
        default: false
    },
    profile_picture: {
        type: String,
        default: ""
    }
})

module.exports = mongoose.model('users', userSchema)

