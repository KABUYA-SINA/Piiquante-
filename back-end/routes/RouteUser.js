const express = require('express')
const router = express.Router()


const userController = require('../controllers/user')
const validator = require('../middleware/validator')



router.post('/signup', validator, userController.signup)
router.post('/login', userController.login)



module.exports = router