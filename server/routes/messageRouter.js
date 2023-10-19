const router = require('express').Router()
const messageController = require('../controllers/messageController')

router.get('/:id', messageController.getConversation)

module.exports = router