var express = require('express')
var router = express.Router()
var account = require('../controller/account')
var cors = require('cors')
router.use(cors({
  origin: 'http://localhost:8080',
  credentials: true
}))
/* GET home page. */
router.get('/', account.list)
router.post('/add', account.save)
//  router.get('/add', account.add)
//  router.get('/modify/:id', account.edit)
router.post('/modify/:id', account.save_edit)
router.get('/deleteaccount/:id', account.delete)
router.get('/deletegroup/:id', account.deleteGroup)
router.get('/register', function (req, res, next) {
  res.render('account/register.ejs', { locals: { session: req.session } })
})
router.post('/register', account.register)
router.get('/login', function (req, res, next) {
  res.render('account/login.ejs', { locals: { session: req.session } })
})
router.get('/groups', account.getGroups)
//  router.get('/group', account.group)
router.post('/group', account.group_save)
router.post('/login', account.login)
router.get('/logout', account.logout)
router.get('/pseudo/:pseudoo', account.getPseudo)
router.get('/accounts', account.getAccounts)
router.get('/account/:id', account.getOneAccount)
router.get('/users', account.getUsers)
router.get('/promote/:id', account.promote)
router.get('/revoke/:id', account.revoke)
router.get('/deleteUser/:id', account.deleteUser)
module.exports = router
