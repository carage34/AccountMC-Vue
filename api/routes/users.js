var express = require('express')
var router = express.Router()
var users = require('../controller/users')

//router.get('/', users.users_list)
//router.get('/modify/:id', users.user_edit)
router.post('/modify/:id', users.user_edit_save)
router.get('/delete/:id', users.delete)

module.exports = router
