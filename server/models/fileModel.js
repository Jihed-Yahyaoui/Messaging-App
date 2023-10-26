const mongoose = require('mongoose')

const fileSchema = new mongoose.Schema({
    filename: {
        type: String,
        default: ""
    },
    originalname: {
        type: String,
        default: ""
    }
}, { timestamps: true })

module.exports = mongoose.model('files', fileSchema)

