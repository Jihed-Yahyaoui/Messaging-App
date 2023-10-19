const router = require('express').Router()
const userController = require('../controllers/userController')
const jwtauth = require('../utils/jwtauth')

router.post('/create', userController.createUser) // Sign up
router.post('/googleUser', userController.createOrLoginGoogleUser) // Sign up as a google user
router.post('/login', userController.logInUser) // Log in
router.get('/activate/:hash', userController.activateUser) // Activate account
router.get('/home', jwtauth, userController.getUser) // get main data
router.get('/search/:search', jwtauth, userController.searchUser) // search user
module.exports = router
