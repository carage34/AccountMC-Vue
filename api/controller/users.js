var server = require('../server.js')

exports.user_edit_save = function (req, res, next) {
  if ((req.session.superadmin !== 1)) {
    res.redirect('/')
  }
  var id = req.params.id
  var input = JSON.parse(JSON.stringify(req.body))
  req.getConnection(function (err, connection) {
    if (err) {
      console.log(err)
    }
    var admin = 0
    var superadmin = 0
    var membre = 0
    var ajouter = 0
    if (input.ajouter === 'true') {
      ajouter = 1
    }
    if (input.admin === 'true') {
      admin = 1
    }
    console.log(admin)
    if (input.sadmin === 'true') { superadmin = 1 }
    if (input.membre === 'true') { membre = 1 }
    if (admin === 1) {
      membre = 1
    }
    if (superadmin === 1) {
      membre = 1
      admin = 1
    }
    var data = {
      pseudo: input.pseudo,
      superadmin: superadmin,
      admin: admin,
      membre: membre,
      ajouter: ajouter
    }
    console.log(data)
    req.sessionStore.destroy(server.getUser(id), function () { })
    connection.query('UPDATE users set ? WHERE id = ?', [data, id], function (err, rows) {
      if (err) {
        console.log('Error in Updating : ' + err)
        res.json({ success: false })
      } else {
        res.json({ success: true })
      }
    })
  })
}

exports.delete = function (req, res, next) {
  if ((req.session.superadmin !== 1)) {
    res.redirect('/')
  }
  var id = req.params.id
  req.getConnection(function (err, connection) {
    if (err) {
      console.log(err)
    }
    if ((req.session.admin === 1) || (req.session.superadmin === 1)) {
      connection.query('DELETE FROM users where id = ?', [id], function (err, rows) {
        if (err) {
          console.log('Error in Deleting : ' + err)
        } else {
          res.redirect('/users')
        }
      })
    }
  })
}
