const models = require('../models');
const Promise = require('bluebird');

module.exports.createSession = (req, res, next) => {
  if (req.cookies.shortlyid) {
    var hash = req.cookies.shortlyid;
    models.Sessions.get({hash})
      .then((data) => {
        if (data) {
          req.session = data;
          res.cookie('shortlyid', req.session.hash);
          var id = data.userId;
          if (id) {
            req.session.userId = id;
            models.Users.get({id})
              .then((data) => {
                req.session.user = { username: data.username };
                next();

              });
          } else {
            next();
          }
        } else {
          models.Sessions.create()
            .then((data) => {
              var id = data.insertId;
              return models.Sessions.get({id});
            })
            .then((data) => {
              req.session = data;
              res.cookie('shortlyid', req.session.hash);
              next();
            });
        }
      });
  } else {
    models.Sessions.create()
      .then((data) => {
        var id = data.insertId;
        return models.Sessions.get({id});
      })
      .then((data) => {
        req.session = data;
        res.cookie('shortlyid', req.session.hash);
      })
      .then(() => {
        var username = req.body.username;
        req.session.user = {username};
        return models.Users.get({username});
      })
      .then((data) => {
        if (data && data.id) {
          req.session.userId = data.id;
        }
        next();
      });
  }
};

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/


/*
- write a createSession middleware function that accesses the parsed cookies on the request,

- looks up the user data related to that session,

- and assigns an object to a session property on the request that contains relevant user information.
*/