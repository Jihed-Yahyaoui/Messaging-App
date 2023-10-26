const router = require('express').Router()
const fileController = require('../controllers/fileController')
const multer = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/")
    },

    filename: function (req, file, cb) {
        file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8');
        cb(null, file.fieldname)
    }
})
const upload = multer({ storage })

router.get('/:id', (req, res) =>
    res.download(__dirname + '/../uploads/' + req.params.id, req.query.filename)
)
router.post('/:id', upload.any(), fileController.createFile)

module.exports = router