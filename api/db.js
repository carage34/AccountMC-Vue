require ('custom-env').env(true);
var mysql = require("mysql");
//Get database conf
const DB_NAME = process.env.DB_NAME;
const DB_PASS = process.env.DB_PASS;
const DB_USER = process.env.DB_USER;
const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT

var pool = mysql.createPool({
    connexionLimit : 10,
    host     : DB_HOST,
    user     :  DB_USER,
    password : DB_PASS,
    database : DB_NAME,
    port: DB_PORT
});

module.exports = pool;
module.exports.pool = pool;