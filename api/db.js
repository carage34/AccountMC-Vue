require('custom-env').env(true)
var mysql = require('mysql')
//Get database conf
const DB_NAME = process.env.DB_NAME
const DB_PASS = process.env.DB_PASS
const DB_USER = process.env.DB_USER
const DB_HOST = process.env.DB_HOST
const DB_PORT = process.env.DB_PORT

var pool = mysql.createPool({
  connexionLimit: 10,
  host: 'dwarves.iut-fbleau.fr',
  user: 'jully',
  password: 'toto77370',
  database: 'jully',
  port: '3306'
})

module.exports = pool
module.exports.pool = pool
