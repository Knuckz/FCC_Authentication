const passport = require('passport');
const bcrypt   = require('bcrypt');
const LocalStrategy = require('passport-local');
const ObjectID    = require('mongodb').ObjectID;

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
};

module.exports = function (app, db) {
  app.route('/').get((req, res) => {
    res.render(
      `${process.cwd()}/views/pug/index.pug`,
      { title: 'Home Page', message: 'Please Login', showLogin: true, showRegistration: true }
    );
  });
  
  app.get('/profile', ensureAuthenticated, (req, res) => {
    res.render(`${process.cwd()}/views/pug/profile.pug`,
              {username: req.user.username});
  });
  
    app.post('/login', passport.authenticate('local', { failureRedirect: '/' }), (req, res) => {
      res.redirect('/profile');
  });
    
  app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });

  app.route('/register').post(((req, res, next) => {
    db.collection('users').findOne({ username: req.body.username }, function(err, user) {
      if (err) {
        console.log(err);
        next(err);
      } else if (user) {
        res.redirect('/');
      } else {
        let hash = bcrypt.hashSync(req.body.password, 12);
        db.collection('users'.insertOne({
          username: req.body.username,
          password: hash
        }), (err, doc) => {
          if (err) {
            res.redirect('/');
          }
          next(null, user);
        })
      }
    })
  }),
    passport.authenticate('local', { failureRedirect: '/' }),
    (req, res, next) => {
      res.redirect('/profile');
    }
  );
}