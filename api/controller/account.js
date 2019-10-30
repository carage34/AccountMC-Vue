var crypt = require('../crypt.js')
const bcrypt = require('bcrypt')
var server = require('../../server.js')
var db = require('../db.js')
const request = require('request')

exports.list = function (req, res, next) {
  if (!(req.session.membre)) {
    // res.render("account/fdp.ejs")
  }
  req.getConnection(function (err, connection) {
    if (err) throw err
    connection.query('SELECT * FROM account', function (err, rows) {
      if (err) console.log('Error Seleting list : ' + err)
    })
  })
}

exports.save = function (req, res, next) {
  /* if((req.session.admin!=1)&&(req.session.superadmin!=1)) {
   res.redirect("/");
 } */
  var input = req.body
  var email = input.email
  var nom = input.nom
  var password = input.password
  var position = input.position

  let requestBody = {
    'agent': {
      'name': 'Minecraft',
      'version': 1
    },
    'username': email,
    'password': password
  }

  request({
    'uri': 'https://authserver.mojang.com/authenticate',
    'method': 'POST',
    'json': requestBody
  }, (err, ress, body) => {
    if (!err) {
      if (body.hasOwnProperty('error')) {
        res.json({ status: 'failed', error: 'Identifiants invalides' })
        return
      }
      req.getConnection(function (err, connection) {
        if (err) throw err
        var data = {
          email: email,
          nom: nom,
          mdp: crypt.encrypt(password),
          position: position,
          url: 'https://crafatar.com/avatars/' + body.selectedProfile.id
        }
        connection.query('INSERT INTO account set ?', data, function (err, rows, fields) {
          if (err) { console.log('Error in Inserting Data : ' + err) } else {
            console.log('ins : ' + rows.insertId)
            data.id = rows.insertId
            res.json({ status: 'success' })
          }
        })
      })
    } else {
      console.error('Authenticate failed : ' + err)
    }
  })
}

exports.save_edit = function (req, res, next) {
  var input = req.body
  var id = req.params.id
  if (req.session.admin === 1) {
    req.getConnection(function (err, connection) {
      if (err) throw err
      var data = {
        email: input.email,
        nom: input.nom,
        position: input.position
      }
      connection.query('UPDATE account set ? WHERE id = ?', [data, id], function (err, rows) {
        if (err) {
          res.json({ status: 'error', error: 'Erreur lors de la modification' })
        } else {
          res.json({ status: 'success' })
        }
      })
    })
  } else {
    res.json({ status: 'error', error: 'Vous n\'etes pas pas administrateur' })
  }
}

exports.delete = function (req, res, next) {
  var id = req.params.id
  req.getConnection(function (err, connection) {
    if (err) throw err
    if ((req.session.admin === 1)) {
      connection.query('DELETE FROM account where id = ?', [id], function (err, rows) {
        if (err) {
          console.log('Error in Updating : ' + err)
          res.json({ status: 'error' })
        } else {
          res.json({ status: 'success' })
        }
      })
    } else {
      res.json({ status: 'error', error: 'Vous n\'êtes pas admin' })
    }
  // res.json({ status: 'success' })
  })
}

exports.register = function (req, res, next) {
  var input = req.body
  console.log('Input ')
  console.log(input)
  console.log(req.body)
  req.getConnection(function (err, connection) {
    if (err) throw err
    var data = {
      pseudo: input.pseudo,
      mdp: bcrypt.hashSync(input.pass, 10)
    }
    connection.query('INSERT INTO users set ?', data, function (err, rows, fields) {
      if (err) {
        res.json({ info: 'error' })
        console.log('Error in Inserting Data : ' + err)
      } else {
        req.session.pseudo = input.pseudo
        res.json({ success: 'Inscription réussi' })
      }
    })
  })
}

exports.login = function (req, res, next) {
  var input = req.body
  var pseudo = input.pseudo
  var password = input.password
  console.log(pseudo)
  console.log(password)

  // if(pseudo && password) {
  req.getConnection(function (err, connection) {
    if (err) throw err
    connection.query('SELECT * FROM users WHERE pseudo = ?', [pseudo], function (error, results, fields) {
      if (error) throw error
      // console.log(error);
      if (results.length > 0) {
        server.addUser(results[0].id, req.session.id)
        req.session.key = results[0].id
        if (bcrypt.compareSync(password, results[0].mdp)) {
          req.session.pseudo = results[0].pseudo
          req.session.superadmin = results[0].superadmin
          req.session.admin = results[0].admin
          console.log('plzzz ' + req.session.admin)
          req.session.membre = results[0].membre
          req.session.ajouter = results[0].ajouter
          req.session.ids = results[0].id
          res.json({ auth: 'success', admin: results[0].admin })
        } else {
          res.json({ auth: 'failed', error: 'Mot de passe incorrect' })
        }
      } else {
        res.json({ auth: 'failed', error: 'Pseudo incorrect' })
      }
    })
  })
}

exports.group_save = function (req, res, next) {
  if ((req.session.admin !== 1) && (req.session.superadmin !== 1)) {
    res.redirect('/')
  }
  var input = JSON.parse(JSON.stringify(req.body))
  var arrId = input.arrId
  var groupName = input.groupName
  console.log('tab ' + arrId)
  console.log('groupName ' + groupName)
  exports.insertGroup(groupName).then(function (result) {
    console.log('group id ' + result)

    req.getConnection(function (err, connection) {
      if (err) throw err
      for (var i = 0; i < arrId.length; i++) {
        var data = {
          idAccount: arrId[i],
          idGroup: result
        }
        console.log(data)
        connection.query('INSERT INTO accountGroup set ?', [data], function (err, rows) {
          if (err) { console.log('Error in inserting acountGroup : ' + err) } else {

          }
        })
      }
    })

    res.redirect('/')
  })
}

exports.logout = function (req, res, next) {
  if (req.session) {
    // delete session object
    req.session.destroy(function (err) {
      if (err) {
        return next(err)
      } else {
        return res.redirect('/')
      }
    })
  }
}

exports.insertGroup = function (groupName) {
  return new Promise((resolve, reject) => {
    var data = {
      nom: groupName
    }
    db.pool.getConnection(function (err, connection) {
      if (err) throw err
      connection.query('INSERT INTO groups set ?', data, function (err, results, fields) {
        connection.release()
        if (err) console.log('Error Inserting group : ' + err)
        resolve(results.insertId)
      })
    })
  })
}

exports.getGroups = function (req, res, next) {
  return new Promise((resolve, reject) => {
    db.pool.getConnection(function (err, connection) {
      if (err) throw err
      connection.query('SELECT groups.id idGroup, account.id, account.nom accountName, account.url, groups.nom groupName FROM accountGroup, account, groups WHERE account.id = accountGroup.idAccount AND accountGroup.idGroup = groups.id', function (err, results, fields) {
        connection.release()
        if (err) console.log('Error Seleting list : ' + err)
        console.log('groups')
        //console.log(results)
        resolve(results)
      })
    })
  })
}

exports.getAccounts = function (req, res, next) {
  return new Promise((resolve, reject) => {
    db.pool.getConnection(function (err, connection) {
      if (err) throw err
      connection.query('SELECT * FROM account', function (err, results, fields) {
        connection.release()
        if (err) console.log('Error Seleting list : ' + err)
        resolve(results)
      })
    })
  })
}

exports.getOneAccount = function (req, res, next) {
  var id = req.params.id
  db.pool.getConnection(function (err, connection) {
    if (err) throw err
    connection.query('SELECT * FROM account WHERE id = ?', id, function (err, results, fields) {
      connection.release()
      if (err) console.log('Error Seleting list : ' + err)
      res.json(results)
    })
  })
}

exports.getUsers = function (req, res, next) {
  var users = {}
  db.pool.getConnection(function (err, connection) {
    if (err) throw err
    connection.query('SELECT * FROM users', function (err, result, fields) {
      connection.release()
      if (err) throw err
      result.forEach(function (element, index) {
        element.load = false
        users[element.id] = element
      })
      res.json(users)
    })
  })
}

exports.deleteUser = function (req, res, next) {
  if (req.session.admin === 1) {
    var id = req.params.id
    db.pool.getConnection(function (err, connection) {
      if (err) throw err
      connection.query('DELETE FROM users where id = ?', id, function (err, result, fields) {
        connection.release()
        if (err) throw err
        res.json({ status: 'success' })
      })
    })
  } else {
    res.json({ status: 'error', error: 'Vous n\'etes pas admin' })
  }
}

exports.promote = function (req, res, next) {
  if (req.session.admin === 1) {
    var id = req.params.id
    db.pool.getConnection(function (err, connection) {
      if (err) throw err
      connection.query('UPDATE users set admin = 1 WHERE id = ?', id, function (err, result, fields) {
        if (err) throw err
        res.json({ status: 'success' })
      })
    })
  } else {
    res.json({ status: 'error', error: 'Vous n\'êtes pas admin' })
  }
}

exports.revoke = function (req, res, next) {
  if (req.session.admin === 1) {
    var id = req.params.id
    db.pool.getConnection(function (err, connection) {
      if (err) throw err
      connection.query('UPDATE users set admin = 0 WHERE id = ?', id, function (err, result, fields) {
        if (err) throw err
        res.json({ status: 'success' })
      })
    })
  } else {
    res.json({ status: 'error', error: 'Vous n\'êtes pas admin' })
  }
}

exports.getAccountsAPI = function (req, res, next) {
  db.pool.getConnection(function (err, connection) {
    if (err) throw err
    connection.query('SELECT * FROM account', function (err, results, fields) {
      connection.release()
      if (err) console.log('Error Seleting list : ' + err)
      res.json(results)
    })
  })
}

exports.setAvatar = function (id, filename) {
  console.log('start insert')
  console.log('id : ' + id)
  console.log('id : ' + filename)
  db.query('UPDATE account SET avatar = ? WHERE id = ?', [filename, id], function (err, rows) {
    if (err) {
      console.log('Error in Updating data' + err)
    }
  })
  console.log('end insert')
}

exports.getPseudo = function (req, res, next) {
  var pseudo = req.params.pseudoo
  request('https://api.mojang.com/users/profiles/minecraft/' + pseudo, { json: true }, (err, ress, body) => {
    if (err) { return console.log(err) }
    if (typeof body === 'undefined') {
      res.json({ success: false })
    } else {
      res.json({ success: true })
    }
  })
}

exports.deleteGroup = function (req, res, next) {
  var id = req.params.id
  req.getConnection(function (err, connection) {
    if (err) throw err
    if ((req.session.admin === 1) || (req.session.superadmin === 1)) {
      connection.query('DELETE FROM groups where id = ?', [id], function (err, rows) {
        if (err) {
          console.log('Error in Updating : ' + err)
        } else {
          // res.redirect("/");
        }
      })
    }
  })
}
