var express = require('express');
var router = express.Router();
var authService = require('../services/authService');

var validationMinLength = 5;

router.get('/', function(req, res, next) {
  res.render('partial/register');
});

router.post('/', function(req, res, next) {
  const username = req.body.username;
  const password = req.body.password;
  const password2 = req.body.password2;

  req.checkBody('username', 'Username field is required').notEmpty();
  req.checkBody('username', `Username must be at least ${validationMinLength} characters`).isLength({min : validationMinLength})
  req.checkBody('password', 'Password field is required').notEmpty();
  req.checkBody('password', `Password must be at least ${validationMinLength} characters`).isLength({min : validationMinLength})
  req.checkBody('password', 'Password do not match').equals(password2);

  var errors = req.validationErrors();

  if (errors) {
    res.render('partial/register', { errors : errors });
  } else {
    authService.register(username, password)
    .then((user) => authService.authenticate(req, res))    
    .then(() => {
      res.redirect('/')
    })    
    .catch((err) => {
      res.render('partial/register', { error : err.message })
    });
  }    
});

module.exports = router;