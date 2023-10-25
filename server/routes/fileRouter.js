const router = require('express').Router()
const fileController = require('../controllers/fileController')
const multer = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/")
    }
})
const upload = multer({ storage })

router.post('/:id', upload.any())

module.exports = router