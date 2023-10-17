const express = require('express')
const router = express.Router()
const usersController = require('../controllers/authController')

router.route('/')
    .post()

router.route('/refresh')
    .get()

router.route('/logout')
    .get()

module.exports = router